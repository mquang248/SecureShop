const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { xssProtection } = require('../middleware/security');

// Create rate limiter for sensitive operations
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

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -mfaSecret -backupCodes');
    
    res.json({
      success: true,
      data: user
    });
  })
);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile',
  xssProtection,
  [
    body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
    body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
    body('phone').optional().trim().isLength({ min: 0, max: 20 }),
    body('address.street').optional().trim().isLength({ min: 0, max: 100 }),
    body('address.city').optional().trim().isLength({ min: 0, max: 50 }),
    body('address.state').optional().trim().isLength({ min: 0, max: 50 }),
    body('address.zipCode').optional().trim().isLength({ min: 0, max: 20 }),
    body('address.country').optional().trim().isLength({ min: 0, max: 50 }),
    body('preferences.newsletter').optional().isBoolean(),
    body('preferences.notifications').optional().isBoolean(),
    body('preferences.emailMarketing').optional().isBoolean(),
    body('preferences.emailOrderUpdates').optional().isBoolean(),
    body('preferences.emailSecurity').optional().isBoolean(),
    body('preferences.pushNotifications').optional().isBoolean()
  ],
  auditLog('profile_update'),
  asyncHandler(async (req, res) => {
    console.log('Profile update request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'phone', 'address', 'preferences', 'avatar'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -mfaSecret -backupCodes');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  })
);

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
router.put('/change-password',
  sensitiveRateLimit,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  ],
  auditLog('password_change'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  })
);

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
router.put('/preferences',
  xssProtection,
  [
    body('preferences.emailMarketing').optional().isBoolean(),
    body('preferences.emailOrderUpdates').optional().isBoolean(),
    body('preferences.emailSecurity').optional().isBoolean(),
    body('preferences.pushNotifications').optional().isBoolean()
  ],
  auditLog('preferences_update'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: req.body.preferences },
      { new: true, runValidators: true }
    ).select('-password -mfaSecret -backupCodes');

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { user }
    });
  })
);

module.exports = router;
