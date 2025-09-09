const jwt = require('jsonwebtoken');
const User = require('../models/User');
const speakeasy = require('speakeasy');

// Authenticate token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('+mfaSecret');
    
    if (!user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token'
      });
    }

    // Check if user is locked
    if (user.isLocked) {
      return res.status(423).json({
        error: 'Account locked',
        message: 'Account is temporarily locked due to failed login attempts'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Token expired'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Authentication failed'
    });
  }
};

// Admin authentication middleware
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      error: 'Access denied',
      message: 'Admin access required'
    });
  }
};

// Optional authentication (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user && !user.isLocked && user.isVerified) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // If optional auth fails, continue without user
    next();
  }
};

// MFA verification middleware
const verifyMFA = async (req, res, next) => {
  try {
    const { mfaToken } = req.body;
    const user = req.user;

    if (!user.mfaEnabled) {
      return next(); // MFA not enabled, continue
    }

    if (!mfaToken) {
      return res.status(400).json({
        error: 'MFA required',
        message: 'MFA token is required'
      });
    }

    // Verify MFA token
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: mfaToken,
      window: 2 // Allow 2 time steps (60 seconds) tolerance
    });

    if (!verified) {
      // Check if it's a backup code
      const backupCode = user.backupCodes.find(code => 
        code.code === mfaToken.toUpperCase() && !code.used
      );

      if (backupCode) {
        backupCode.used = true;
        await user.save();
      } else {
        return res.status(401).json({
          error: 'Invalid MFA token',
          message: 'The provided MFA token is invalid'
        });
      }
    }

    next();
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'MFA verification failed'
    });
  }
};

// Rate limiting for sensitive operations
const sensitiveRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for sensitive operations
  message: {
    error: 'Too many attempts',
    message: 'Too many sensitive operations attempted, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// IP-based rate limiting for auth endpoints
const authRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Too many login attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Generate JWT token
const generateToken = (userId, expiresIn = process.env.JWT_EXPIRE || '7d') => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn,
    issuer: 'SecureShop',
    audience: 'SecureShop-Users'
  });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId, type: 'refresh' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
    issuer: 'SecureShop',
    audience: 'SecureShop-Users'
  });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth,
  verifyMFA,
  sensitiveRateLimit,
  authRateLimit,
  generateToken,
  verifyToken,
  generateRefreshToken
};
