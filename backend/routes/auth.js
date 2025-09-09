const express = require('express');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const { 
  generateToken, 
  generateRefreshToken, 
  verifyToken,
  authenticateToken,
  verifyMFA 
} = require('../middleware/auth');

// Import rate limiting
const rateLimit = require('express-rate-limit');

// Auth rate limiter
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Too many login attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Sensitive operations rate limiter
const sensitiveRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for sensitive operations
  message: {
    error: 'Too many attempts',
    message: 'Too many sensitive operations attempted, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { 
  xssProtection, 
  validateCriticalFields, 
  honeypotValidation
} = require('../middleware/security');

// Simple audit log function
const auditLog = (action) => {
  return (req, res, next) => {
    const logData = {
      action,
      user: req.user ? req.user._id : 'anonymous',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    };
    
    console.log('AUDIT:', JSON.stringify(logData));
    next();
  };
};
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', 
  authRateLimit,
  xssProtection,
  validateCriticalFields,
  honeypotValidation,
  registerValidation,
  auditLog('user_register'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, name, phone } = req.body;

    // Split name into firstName and lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'Registration failed',
        message: 'User with this email already exists'
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      verificationToken,
      ipAddress: req.ip
    });

    // Send verification email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to SecureShop - Verify Your Email',
        message: `Please verify your email by clicking this link: ${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      }
    });
  })
);

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
router.post('/verify-email',
  authRateLimit,
  asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Verification failed',
        message: 'Verification token is required'
      });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        error: 'Verification failed',
        message: 'Invalid or expired verification token'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully. You can now login.'
    });
  })
);

// @desc    Manual verify email by email (for development)
// @route   POST /api/auth/verify-by-email
// @access  Public
router.post('/verify-by-email',
  authRateLimit,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Verification failed',
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: 'Verification failed',
        message: 'User not found'
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully. You can now login.',
      user: {
        email: user.email,
        isVerified: user.isVerified
      }
    });
  })
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login',
  authRateLimit,
  xssProtection,
  validateCriticalFields,
  loginValidation,
  auditLog('user_login'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, mfaToken } = req.body;

    // Get user with password
    const user = await User.findOne({ email }).select('+password +mfaSecret');

    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        error: 'Account locked',
        message: 'Account is temporarily locked due to failed login attempts'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified (disabled for development)
    // if (!user.isVerified) {
    //   return res.status(403).json({
    //     error: 'Email not verified',
    //     message: 'Please verify your email address before logging in'
    //   });
    // }

    // Check MFA if enabled
    if (user.mfaEnabled) {
      if (!mfaToken) {
        return res.status(200).json({
          success: true,
          requiresMFA: true,
          message: 'MFA token required'
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: mfaToken,
        window: 2
      });

      if (!verified) {
        // Check backup codes
        const backupCode = user.backupCodes.find(code => 
          code.code === mfaToken.toUpperCase() && !code.used
        );

        if (backupCode) {
          backupCode.used = true;
          await user.save();
        } else {
          await user.incLoginAttempts();
          return res.status(401).json({
            error: 'Invalid MFA token',
            message: 'The provided MFA token is invalid'
          });
        }
      }
    }

    // Reset login attempts and update last login
    await user.resetLoginAttempts();
    user.ipAddress = req.ip;
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          mfaEnabled: user.mfaEnabled
        }
      }
    });
  })
);

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh',
  authRateLimit,
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Refresh token is required'
      });
    }

    try {
      const decoded = verifyToken(refreshToken);
      
      if (decoded.type !== 'refresh') {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'Invalid refresh token'
        });
      }

      const user = await User.findById(decoded.id);
      if (!user || !user.isVerified) {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'User not found or not verified'
        });
      }

      const newToken = generateToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);

      res.json({
        success: true,
        data: {
          token: newToken,
          refreshToken: newRefreshToken
        }
      });
    } catch (error) {
      res.status(401).json({
        error: 'Invalid token',
        message: 'Invalid refresh token'
      });
    }
  })
);

// @desc    Setup MFA/2FA
// @route   POST /api/auth/setup-mfa
// @access  Private
router.post('/setup-mfa',
  authenticateToken,
  sensitiveRateLimit,
  auditLog('mfa_setup'),
  asyncHandler(async (req, res) => {
    const user = req.user;

    if (user.mfaEnabled) {
      return res.status(400).json({
        error: 'MFA already enabled',
        message: 'MFA is already enabled for this account'
      });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `SecureShop (${user.email})`,
      issuer: 'SecureShop'
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Save secret (but don't enable MFA yet)
    user.mfaSecret = secret.base32;
    await user.save();

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        manualEntryKey: secret.base32
      }
    });
  })
);

// @desc    Verify and enable MFA
// @route   POST /api/auth/verify-mfa
// @access  Private
router.post('/verify-mfa',
  authenticateToken,
  sensitiveRateLimit,
  auditLog('mfa_verify'),
  asyncHandler(async (req, res) => {
    const { token } = req.body;
    const user = req.user;

    if (!token) {
      return res.status(400).json({
        error: 'Token required',
        message: 'MFA token is required'
      });
    }

    if (!user.mfaSecret) {
      return res.status(400).json({
        error: 'MFA not setup',
        message: 'Please setup MFA first'
      });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Invalid MFA token'
      });
    }

    // Enable MFA and generate backup codes
    user.mfaEnabled = true;
    const backupCodes = user.generateBackupCodes();
    await user.save();

    res.json({
      success: true,
      message: 'MFA enabled successfully',
      data: {
        backupCodes
      }
    });
  })
);

// @desc    Disable MFA
// @route   POST /api/auth/disable-mfa
// @access  Private
router.post('/disable-mfa',
  authenticateToken,
  sensitiveRateLimit,
  verifyMFA,
  auditLog('mfa_disable'),
  asyncHandler(async (req, res) => {
    const user = req.user;

    user.mfaEnabled = false;
    user.mfaSecret = undefined;
    user.backupCodes = [];
    await user.save();

    res.json({
      success: true,
      message: 'MFA disabled successfully'
    });
  })
);

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password',
  authRateLimit,
  body('email').isEmail().normalizeEmail(),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send reset email
    try {
      await sendEmail({
        email: user.email,
        subject: 'SecureShop - Password Reset Request',
        message: `You requested a password reset. Click this link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${resetToken}\n\nThis link will expire in 10 minutes.`
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      
      return res.status(500).json({
        error: 'Email sending failed',
        message: 'Could not send reset email. Please try again later.'
      });
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  })
);

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
router.post('/reset-password/:token',
  authRateLimit,
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  auditLog('password_reset'),
  asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Hash token and find user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'Token is invalid or has expired'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  })
);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .populate('preferences')
      .select('-password -mfaSecret -backupCodes');

    res.json({
      success: true,
      data: { user }
    });
  })
);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout',
  authenticateToken,
  auditLog('user_logout'),
  asyncHandler(async (req, res) => {
    // In a more sophisticated setup, you might want to blacklist the token
    res.json({
      success: true,
      message: 'Logout successful'
    });
  })
);

module.exports = router;
