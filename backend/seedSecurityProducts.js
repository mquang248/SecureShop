const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  {
    name: 'Secure Storage Devices',
    slug: 'secure-storage-devices',
    description: 'Hard drives, USB and storage devices with high security features',
    isActive: true
  },
  {
    name: 'Authentication Devices',
    slug: 'authentication-devices',
    description: 'Security USB, password managers and biometric authentication devices',
    isActive: true
  },
  {
    name: 'Network Security Devices',
    slug: 'network-security-devices',
    description: 'VPN routers, network monitoring devices and connection protection',
    isActive: true
  },
  {
    name: 'Security Monitoring Devices',
    slug: 'security-monitoring-devices',
    description: 'AI cameras, intrusion detection devices and security monitoring',
    isActive: true
  },
  {
    name: 'Security Software & Apps',
    slug: 'security-software-apps',
    description: 'Anti-phishing software, secure calling apps and protection tools',
    isActive: true
  },
  {
    name: 'Smart Security Wearables',
    slug: 'smart-security-wearables',
    description: 'Smartwatches, headsets and wearable devices with security features',
    isActive: true
  }
];

const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@secureshop.com',
    password: 'admin123',
    role: 'admin',
    phone: '+84123456789',
    isEmailVerified: true,
    isActive: true
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    phone: '+84987654321',
    isEmailVerified: true,
    isActive: true
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'user123',
    role: 'user',
    phone: '+84912345678',
    isEmailVerified: true,
    isActive: true
  }
];

const products = [
  {
    name: 'ShieldLock X1',
    slug: 'shieldlock-x1',
    description: 'Next-generation portable hard drive with integrated hardware security. Automatic AES-256 data encryption, unlock with fingerprint or mobile app.',
    price: 8990000,
    comparePrice: 9990000,
    sku: 'SLX1-1TB-BK',
    stock: 25,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
        alt: 'ShieldLock X1 - Secure Hard Drive',
        isPrimary: true
      }
    ],
    category: null,
    status: 'active',
    featured: true,
    rating: {
      average: 4.9,
      count: 45
    },
    tags: ['hardware', 'encryption', 'biometric', 'ssd'],
    brand: 'ShieldTech'
  },
  {
    name: 'VaultPass Pro',
    slug: 'vaultpass-pro',
    description: 'Compact, secure offline password manager device. Generates strong passwords, stores with Secure Element chip, supports 2FA.',
    price: 2990000,
    comparePrice: 3490000,
    sku: 'VPP-01-SLV',
    stock: 40,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        alt: 'VaultPass Pro - Password Manager',
        isPrimary: true
      }
    ],
    category: null,
    status: 'active',
    featured: true,
    rating: {
      average: 4.7,
      count: 78
    },
    tags: ['password', 'offline', '2fa', 'secure-element'],
    brand: 'VaultTech'
  },
  {
    name: 'QuantumVPN Cube',
    slug: 'quantumvpn-cube',
    description: 'Pocket router with hardened VPN features. Automatically encrypts traffic with WireGuard/OpenVPN when connecting to public Wi-Fi.',
    price: 4490000,
    comparePrice: 4990000,
    sku: 'QVC-W6-BK',
    stock: 30,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500',
        alt: 'QuantumVPN Cube - Portable VPN Router',
        isPrimary: true
      }
    ],
    category: null,
    status: 'active',
    featured: true,
    rating: {
      average: 4.6,
      count: 62
    },
    tags: ['vpn', 'router', 'wifi6', 'wireguard'],
    brand: 'QuantumNet'
  },
  {
    name: 'BioKey Ultra',
    slug: 'biokey-ultra',
    description: 'Security USB with fingerprint authentication. Login to OS, websites, cloud services using biometrics.',
    price: 1990000,
    comparePrice: 2290000,
    sku: 'BKU-USB-MT',
    stock: 60,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500',
        alt: 'BioKey Ultra - Fingerprint Authentication USB',
        isPrimary: true
      }
    ],
    category: null,
    status: 'active',
    featured: false,
    rating: {
      average: 4.5,
      count: 134
    },
    tags: ['biometric', 'usb', 'fido2', 'passwordless'],
    brand: 'BioSec'
  },
  {
    name: 'SafeComm Headset',
    slug: 'safecomm-headset',
    description: 'Professional headset for business users requiring secure calls. Real-time voice encryption, prevents unauthorized recording.',
    price: 6990000,
    comparePrice: 7990000,
    sku: 'SCH-BT53-BK',
    stock: 20,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
        alt: 'SafeComm Headset - Secure Headset',
        isPrimary: true
      }
    ],
    category: null,
    status: 'active',
    featured: true,
    rating: {
      average: 4.8,
      count: 27
    },
    tags: ['headset', 'encryption', 'business', 'privacy'],
    brand: 'SafeComm'
  },
  {
    name: 'CyberEye Monitor',
    slug: 'cybereye-monitor',
    description: 'Next-generation AI surveillance camera. Detects suspicious behavior (both visual & network traffic), sends cloud alerts.',
    price: 3990000,
    comparePrice: 4590000,
    sku: 'CEM-2K-AI',
    stock: 35,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
        alt: 'CyberEye Monitor - AI Security Camera',
        isPrimary: true
      }
    ],
    category: null,
    status: 'active',
    featured: true,
    rating: {
      average: 4.7,
      count: 89
    },
    tags: ['camera', 'ai', 'monitoring', 'cloud'],
    brand: 'CyberVision'
  },
  {
    name: 'DarkTrace Mini',
    slug: 'darktrace-mini',
    description: 'Compact intrusion detection device for home/small office. Scans all devices in LAN/Wi-Fi, alerts on suspicious IPs or behavior.',
    price: 5490000,
    comparePrice: 5990000,
    sku: 'DTM-100-WH',
    stock: 28,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500',
        alt: 'DarkTrace Mini - Intrusion Detection Device',
        isPrimary: true
      }
    ],
    category: null,
    status: 'active',
    featured: false,
    rating: {
      average: 4.6,
      count: 52
    },
    tags: ['intrusion-detection', 'network', 'ai', 'home-office'],
    brand: 'DarkTrace'
  },
  {
    name: 'CryptoVault Stick',
    slug: 'cryptovault-stick',
    description: 'USB specialized for storing cryptocurrency private keys. Safely manage Bitcoin/Ethereum/Altcoin wallets with Secure Element chip.',
    price: 2490000,
    comparePrice: 2790000,
    sku: 'CVS-SE-BK',
    stock: 45,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500',
        alt: 'CryptoVault Stick - Crypto Storage USB',
        isPrimary: true
      }
    ],
    category: null,
    status: 'active',
    featured: false,
    rating: {
      average: 4.8,
      count: 167
    },
    tags: ['cryptocurrency', 'hardware-wallet', 'secure-element', 'bitcoin'],
    brand: 'CryptoSafe'
  },
  {
    name: 'PhishBlocker Pro',
    slug: 'phishblocker-pro',
    description: 'AI-powered anti-phishing browser add-on. Checks URLs, analyzes fake websites, blocks keyloggers.',
    price: 990000,
    comparePrice: 1290000,
    sku: 'PBP-AI-LIC',
    stock: 100,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500',
        alt: 'PhishBlocker Pro - Phần mềm chống phishing',
        isPrimary: true
      }
    ],
    category: null,
    status: 'active',
    featured: false,
    rating: {
      average: 4.4,
      count: 523
    },
    tags: ['software', 'phishing', 'browser', 'ai'],
    brand: 'SecureBrowse'
  },
  {
    name: 'SafeCall Shield',
    slug: 'safecall-shield',
    description: 'Mobile app for secure calling & messaging. End-to-end encryption (E2EE), self-destructing messages, call ID masking.',
    price: 590000,
    comparePrice: 790000,
    sku: 'SCS-APP-LIC',
    stock: 200,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500',
        alt: 'SafeCall Shield - Secure Calling App',
        isPrimary: true
      }
    ],
    category: null,
    status: 'active',
    featured: false,
    rating: {
      average: 4.3,
      count: 892
    },
    tags: ['mobile-app', 'e2ee', 'secure-calling', 'messaging'],
    brand: 'SafeComm'
  },
  {
    name: 'ZeroTrace Drive',
    slug: 'zerotrace-drive',
    description: 'Single-use USB drive for sensitive data. Automatically wipes clean when removed from computer. Only usable once.',
    price: 1490000,
    comparePrice: 1690000,
    sku: 'ZTD-64GB-OT',
    stock: 50,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
        alt: 'ZeroTrace Drive - Self-Destructing USB',
        isPrimary: true
      }
    ],
    category: null,
    status: 'active',
    featured: false,
    rating: {
      average: 4.7,
      count: 73
    },
    tags: ['usb', 'one-time-use', 'self-destruct', 'confidential'],
    brand: 'ZeroTech'
  },
  {
    name: 'Guardian Watch',
    slug: 'guardian-watch',
    description: 'Security smartwatch for tech users. Alerts when detecting unknown devices connecting to personal Wi-Fi.',
    price: 7990000,
    comparePrice: 8990000,
    sku: 'GW-16-BK',
    stock: 22,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        alt: 'Guardian Watch - Security Smartwatch',
        isPrimary: true
      }
    ],
    category: null,
    status: 'active',
    featured: true,
    rating: {
      average: 4.5,
      count: 156
    },
    tags: ['smartwatch', 'security', 'iot', 'monitoring'],
    brand: 'SecureWear'
  }
];

async function seedSecurityProducts() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'your-mongo-connection-string';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
    
    console.log('🛡️ Starting security products seeding...');
    
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Cleared existing data');
    
    // Create categories first
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} security categories`);
    
    // Create users with hashed passwords
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Assign categories to products and set createdBy
    const adminUser = createdUsers.find(user => user.role === 'admin');
    
    products[0].category = createdCategories[0]._id; // ShieldLock X1 -> Secure Storage Devices
    products[0].createdBy = adminUser._id;
    
    products[1].category = createdCategories[1]._id; // VaultPass Pro -> Authentication Devices
    products[1].createdBy = adminUser._id;
    
    products[2].category = createdCategories[2]._id; // QuantumVPN Cube -> Thiết bị mạng bảo mật
    products[2].createdBy = adminUser._id;
    
    products[3].category = createdCategories[1]._id; // BioKey Ultra -> Thiết bị xác thực
    products[3].createdBy = adminUser._id;
    
    products[4].category = createdCategories[5]._id; // SafeComm Headset -> Thiết bị đeo thông minh bảo mật
    products[4].createdBy = adminUser._id;
    
    products[5].category = createdCategories[3]._id; // CyberEye Monitor -> Thiết bị giám sát an ninh
    products[5].createdBy = adminUser._id;
    
    products[6].category = createdCategories[3]._id; // DarkTrace Mini -> Thiết bị giám sát an ninh
    products[6].createdBy = adminUser._id;
    
    products[7].category = createdCategories[0]._id; // CryptoVault Stick -> Thiết bị lưu trữ bảo mật
    products[7].createdBy = adminUser._id;
    
    products[8].category = createdCategories[4]._id; // PhishBlocker Pro -> Ứng dụng và phần mềm bảo mật
    products[8].createdBy = adminUser._id;
    
    products[9].category = createdCategories[4]._id; // SafeCall Shield -> Ứng dụng và phần mềm bảo mật
    products[9].createdBy = adminUser._id;
    
    products[10].category = createdCategories[0]._id; // ZeroTrace Drive -> Thiết bị lưu trữ bảo mật
    products[10].createdBy = adminUser._id;
    
    products[11].category = createdCategories[5]._id; // Guardian Watch -> Thiết bị đeo thông minh bảo mật
    products[11].createdBy = adminUser._id;
    
    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} security products`);
    
    console.log('🎉 Security products seeding completed successfully!');
    
    console.log('\n📋 Sample login credentials:');
    console.log('Admin: admin@secureshop.com / admin123');
    console.log('User: user@example.com / user123');
    
    console.log('\n🛡️ Security Product Categories:');
    createdCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.slug})`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding security products:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedSecurityProducts();
