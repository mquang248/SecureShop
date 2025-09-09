const nodemailer = require('nodemailer');

// Create reusable transporter object
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"SecureShop" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || generateEmailHTML(options.subject, options.message)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

// Generate HTML email template
const generateEmailHTML = (subject, message) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
            body {
                font-family: 'Inter', 'Roboto', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .email-container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #0A2540;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #0A2540;
                margin-bottom: 10px;
            }
            .tagline {
                color: #666;
                font-size: 14px;
            }
            .content {
                margin-bottom: 30px;
            }
            .button {
                display: inline-block;
                background-color: #FF6B35;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 12px;
            }
            .security-notice {
                background-color: #f8f9fa;
                border-left: 4px solid #0A2540;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">🔒 SecureShop</div>
                <div class="tagline">Secure Shopping, Powered by Cloud</div>
            </div>
            
            <div class="content">
                ${message.replace(/\n/g, '<br>')}
            </div>
            
            <div class="security-notice">
                <strong>🛡️ Security Notice:</strong><br>
                This email was sent from a secure server. If you didn't request this action, please ignore this email or contact our support team immediately.
            </div>
            
            <div class="footer">
                <p>
                    © ${new Date().getFullYear()} SecureShop. All rights reserved.<br>
                    This email was sent to you as part of your SecureShop account activity.<br>
                    <strong>Secure • Reliable • Trusted</strong>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send welcome email
const sendWelcomeEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  
  const message = `
    Welcome to SecureShop, ${user.firstName}!
    
    Thank you for joining our secure e-commerce platform. To complete your registration and start shopping securely, please verify your email address by clicking the link below:
    
    ${verificationUrl}
    
    This verification link will expire in 24 hours for your security.
    
    Why verify your email?
    • Secure your account with two-factor authentication
    • Receive important order updates and security notifications
    • Access exclusive member benefits and promotions
    
    If you didn't create this account, please ignore this email.
    
    Welcome aboard!
    The SecureShop Team
  `;
  
  return await sendEmail({
    email: user.email,
    subject: 'Welcome to SecureShop - Verify Your Email',
    message
  });
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (user, order) => {
  const orderUrl = `${process.env.FRONTEND_URL}/orders/${order._id}`;
  
  const itemsList = order.items.map(item => 
    `• ${item.name} (Qty: ${item.quantity}) - $${item.price.toFixed(2)}`
  ).join('\n');
  
  const message = `
    Order Confirmation - #${order.orderNumber}
    
    Hi ${user.firstName},
    
    Thank you for your secure order! Your order has been confirmed and is being processed.
    
    Order Details:
    ${itemsList}
    
    Subtotal: $${order.subtotal.toFixed(2)}
    Tax: $${order.tax.toFixed(2)}
    Shipping: $${order.shipping.toFixed(2)}
    Total: $${order.total.toFixed(2)}
    
    Shipping Address:
    ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
    ${order.shippingAddress.address1}
    ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
    
    You can track your order status at: ${orderUrl}
    
    We'll send you another email when your order ships.
    
    Thank you for choosing SecureShop!
    The SecureShop Team
  `;
  
  return await sendEmail({
    email: user.email,
    subject: `Order Confirmation - #${order.orderNumber}`,
    message
  });
};

// Send shipping notification email
const sendShippingNotificationEmail = async (user, order) => {
  const trackingUrl = order.shipping.trackingNumber ? 
    `https://www.example-shipping.com/track/${order.shipping.trackingNumber}` : 
    `${process.env.FRONTEND_URL}/orders/${order._id}`;
  
  const message = `
    Your Order Has Shipped! - #${order.orderNumber}
    
    Hi ${user.firstName},
    
    Great news! Your order has been shipped and is on its way to you.
    
    Shipping Details:
    ${order.shipping.carrier ? `Carrier: ${order.shipping.carrier}` : ''}
    ${order.shipping.trackingNumber ? `Tracking Number: ${order.shipping.trackingNumber}` : ''}
    Estimated Delivery: ${order.shipping.estimatedDelivery ? new Date(order.shipping.estimatedDelivery).toLocaleDateString() : 'TBD'}
    
    You can track your package at: ${trackingUrl}
    
    Shipping Address:
    ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
    ${order.shippingAddress.address1}
    ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
    
    Thank you for shopping with SecureShop!
    The SecureShop Team
  `;
  
  return await sendEmail({
    email: user.email,
    subject: `Your Order Has Shipped - #${order.orderNumber}`,
    message
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const message = `
    Password Reset Request
    
    You requested a password reset for your SecureShop account.
    
    Click the link below to reset your password:
    ${resetUrl}
    
    This link will expire in 10 minutes for your security.
    
    If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
    
    For security reasons, this request was logged with the following details:
    • IP Address: [IP will be logged]
    • Time: ${new Date().toLocaleString()}
    
    If you believe this was a malicious attempt, please contact our security team immediately.
    
    Stay secure!
    The SecureShop Security Team
  `;
  
  return await sendEmail({
    email,
    subject: 'SecureShop - Password Reset Request',
    message
  });
};

// Send security alert email
const sendSecurityAlertEmail = async (user, alertType, details) => {
  const alerts = {
    'suspicious_login': {
      subject: 'Security Alert - Suspicious Login Attempt',
      message: `
        Security Alert for ${user.email}
        
        We detected a suspicious login attempt on your account.
        
        Details:
        • Time: ${new Date().toLocaleString()}
        • IP Address: ${details.ip || 'Unknown'}
        • Location: ${details.location || 'Unknown'}
        • Device: ${details.userAgent || 'Unknown'}
        
        If this was you, you can ignore this email. If not, please:
        1. Change your password immediately
        2. Enable two-factor authentication
        3. Review your recent account activity
        
        Secure your account: ${process.env.FRONTEND_URL}/account/security
      `
    },
    'password_changed': {
      subject: 'Security Notification - Password Changed',
      message: `
        Password Changed Successfully
        
        Your SecureShop account password was recently changed.
        
        Details:
        • Time: ${new Date().toLocaleString()}
        • IP Address: ${details.ip || 'Unknown'}
        
        If you made this change, no further action is required.
        
        If you didn't change your password, please contact our security team immediately and consider that your account may be compromised.
        
        Security Contact: security@secureshop.com
      `
    },
    'mfa_enabled': {
      subject: 'Security Enhancement - Two-Factor Authentication Enabled',
      message: `
        Two-Factor Authentication Enabled
        
        Two-factor authentication has been successfully enabled on your SecureShop account.
        
        Your account is now more secure! You'll need both your password and a verification code to sign in.
        
        Keep your backup codes safe:
        ${details.backupCodes ? details.backupCodes.join(', ') : 'Check your account settings'}
        
        Details:
        • Time: ${new Date().toLocaleString()}
        • IP Address: ${details.ip || 'Unknown'}
      `
    }
  };
  
  const alert = alerts[alertType];
  if (!alert) {
    throw new Error('Invalid alert type');
  }
  
  return await sendEmail({
    email: user.email,
    subject: alert.subject,
    message: alert.message
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendShippingNotificationEmail,
  sendPasswordResetEmail,
  sendSecurityAlertEmail
};
