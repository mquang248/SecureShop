const xss = require('xss');
const { AppError } = require('./errorHandler');

// XSS Protection middleware
const xssProtection = (req, res, next) => {
  try {
    // Clean request body
    if (req.body && typeof req.body === 'object') {
      req.body = cleanObject(req.body);
    }

    // Clean query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = cleanObject(req.query);
    }

    // Clean URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = cleanObject(req.params);
    }

    next();
  } catch (error) {
    next(new AppError('Invalid request data', 400));
  }
};

// Recursively clean object from XSS
const cleanObject = (obj) => {
  const cleaned = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        cleaned[key] = xss(value, {
          whiteList: {},
          stripIgnoreTag: true,
          stripIgnoreTagBody: ['script']
        });
      } else if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          cleaned[key] = value.map(item => 
            typeof item === 'string' ? xss(item) : item
          );
        } else {
          cleaned[key] = cleanObject(value);
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  
  return cleaned;
};

// SQL Injection protection (already handled by express-mongo-sanitize in server.js)
// But adding extra validation for critical fields
const validateCriticalFields = (req, res, next) => {
  const criticalFields = ['email', 'password', 'username'];
  
  criticalFields.forEach(field => {
    if (req.body[field]) {
      const value = req.body[field];
      
      // Check for SQL injection patterns
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
        /(--|\/\*|\*\/|;|'|"|<|>)/,
        /(\b(OR|AND)\b.*=.*)/i
      ];
      
      const hasSqlPattern = sqlPatterns.some(pattern => pattern.test(value));
      
      if (hasSqlPattern) {
        return next(new AppError('Invalid characters detected in input', 400));
      }
    }
  });
  
  next();
};

// File upload security
const validateFileUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return next();
  }

  const files = req.files || [req.file];
  
  for (const file of files) {
    if (!file) continue;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return next(new AppError('File size too large. Maximum 10MB allowed.', 400));
    }

    // Check file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return next(new AppError('Invalid file type. Only images and PDFs allowed.', 400));
    }

    // Check for dangerous file extensions
    const dangerousExtensions = [
      '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
      '.php', '.asp', '.jsp', '.sh', '.ps1', '.py', '.rb', '.pl'
    ];

    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (dangerousExtensions.includes(fileExtension)) {
      return next(new AppError('File type not allowed for security reasons.', 400));
    }

    // Validate filename
    if (!/^[a-zA-Z0-9._-]+$/.test(file.originalname)) {
      return next(new AppError('Invalid filename. Only alphanumeric characters, dots, underscores, and hyphens allowed.', 400));
    }
  }

  next();
};

// Request size validation
const validateRequestSize = (req, res, next) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxSize) {
    return next(new AppError('Request too large', 413));
  }
  
  next();
};

// IP whitelist for admin endpoints
const adminIPWhitelist = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    const allowedIPs = process.env.ADMIN_ALLOWED_IPS ? 
      process.env.ADMIN_ALLOWED_IPS.split(',') : [];
    
    if (allowedIPs.length > 0) {
      const clientIP = req.ip || req.connection.remoteAddress;
      
      if (!allowedIPs.includes(clientIP)) {
        console.warn(`Unauthorized admin access attempt from IP: ${clientIP}`);
        return next(new AppError('Access denied from this IP address', 403));
      }
    }
  }
  
  next();
};

// CSRF Protection for state-changing operations
const csrfProtection = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    const sessionToken = req.session && req.session.csrfToken;
    
    if (process.env.NODE_ENV === 'production' && (!token || token !== sessionToken)) {
      return next(new AppError('Invalid CSRF token', 403));
    }
  }
  
  next();
};

// Honeypot field validation (trap for bots)
const honeypotValidation = (req, res, next) => {
  if (req.body.website || req.body.url || req.body.homepage) {
    // These are honeypot fields that should be empty
    console.warn('Honeypot field filled, possible bot detected:', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      honeypotField: req.body.website || req.body.url || req.body.homepage
    });
    
    return next(new AppError('Invalid request', 400));
  }
  
  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Already handled by helmet in server.js, but adding extra headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

// Audit logging for sensitive operations
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
    
    // In production, you might want to send this to a dedicated logging service
    next();
  };
};

module.exports = {
  xssProtection,
  validateCriticalFields,
  validateFileUpload,
  validateRequestSize,
  adminIPWhitelist,
  csrfProtection,
  honeypotValidation,
  securityHeaders,
  auditLog
};
