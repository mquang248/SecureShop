require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI);

async function seedAllProducts() {
  try {
    console.log('Connected to MongoDB');
    
    // Find existing category and admin user
    let networkCategory = await Category.findOne({ name: 'Network Security' });
    const adminUser = await User.findOne({ role: 'admin' });
    
    // Create additional categories if needed
    const categories = {
      'Network Security': networkCategory,
      'Endpoint Security': await Category.findOne({ name: 'Endpoint Security' }),
      'Data Protection': await Category.findOne({ name: 'Data Protection' }),
      'Identity Management': await Category.findOne({ name: 'Identity Management' }),
      'Cloud Security': null,
      'Mobile Security': null
    };

    // Create missing categories
    for (const [name, existing] of Object.entries(categories)) {
      if (!existing) {
        const newCategory = await Category.create({
          name,
          description: `Advanced ${name.toLowerCase()} solutions`,
          slug: name.toLowerCase().replace(/ /g, '-')
        });
        categories[name] = newCategory;
        console.log(`Created category: ${name}`);
      }
    }

    console.log('Found admin user:', adminUser?.email);
    
    if (!adminUser) {
      console.log('Missing admin user');
      return;
    }
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Create 18 comprehensive products
    const products = [
      {
        name: 'Advanced Firewall System Pro',
        price: 299.99,
        comparePrice: 399.99,
        description: 'Professional-grade firewall with AI threat detection, real-time monitoring capabilities, and advanced intrusion prevention. Features next-generation threat intelligence and automated response mechanisms.',
        shortDescription: 'AI-powered firewall with real-time threat detection',
        category: categories['Network Security']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Advanced Firewall System Pro', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'Firewall Dashboard', isPrimary: false },
          { url: '/placeholder-product.jpg', alt: 'Firewall Configuration', isPrimary: false }
        ],
        featured: true,
        inStock: true,
        sku: 'FW-ADV-001',
        rating: { average: 4.8, count: 124 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Throughput', '10 Gbps'],
          ['Concurrent Connections', '2 Million'],
          ['VPN Tunnels', '5000'],
          ['Warranty', '3 Years']
        ]),
        tags: ['firewall', 'security', 'enterprise', 'ai-powered']
      },
      {
        name: 'Enterprise VPN Gateway Elite',
        price: 599.99,
        comparePrice: 799.99,
        description: 'High-performance VPN gateway for enterprise networks with military-grade encryption, load balancing, and seamless failover capabilities. Supports unlimited concurrent connections.',
        shortDescription: 'Enterprise VPN with unlimited connections',
        category: categories['Network Security']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Enterprise VPN Gateway Elite', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'VPN Control Panel', isPrimary: false }
        ],
        featured: true,
        inStock: true,
        sku: 'VPN-ENT-002',
        rating: { average: 4.7, count: 89 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Encryption', 'AES-256'],
          ['Protocols', 'OpenVPN, IPSec, WireGuard'],
          ['Concurrent Users', 'Unlimited'],
          ['Bandwidth', '25 Gbps']
        ]),
        tags: ['vpn', 'enterprise', 'encryption', 'secure']
      },
      {
        name: 'Intrusion Detection System AI',
        price: 399.99,
        description: 'Advanced IDS with machine learning capabilities for real-time threat detection, behavioral analysis, and automated incident response. Integrates with SIEM systems.',
        shortDescription: 'AI-powered intrusion detection system',
        category: categories['Network Security']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Intrusion Detection System AI', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'IDS Analytics Dashboard', isPrimary: false }
        ],
        featured: false,
        inStock: true,
        sku: 'IDS-ML-003',
        rating: { average: 4.6, count: 67 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Detection Rate', '99.7%'],
          ['False Positives', '<0.1%'],
          ['Network Speed', '40 Gbps'],
          ['Storage', '10 TB']
        ]),
        tags: ['ids', 'machine-learning', 'monitoring', 'siem']
      },
      {
        name: 'Endpoint Protection Suite Ultimate',
        price: 149.99,
        comparePrice: 199.99,
        description: 'Comprehensive endpoint security solution with anti-malware, behavioral analysis, device control, and centralized management. Protects against zero-day threats.',
        shortDescription: 'Complete endpoint security protection',
        category: categories['Endpoint Security']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Endpoint Protection Suite Ultimate', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'Endpoint Management Console', isPrimary: false }
        ],
        featured: true,
        inStock: true,
        sku: 'EPS-COMP-004',
        rating: { average: 4.5, count: 203 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Supported OS', 'Windows, macOS, Linux'],
          ['Real-time Protection', 'Yes'],
          ['Centralized Management', 'Yes'],
          ['Devices', 'Unlimited']
        ]),
        tags: ['endpoint', 'antivirus', 'protection', 'management']
      },
      {
        name: 'Data Encryption Tool Military Grade',
        price: 199.99,
        description: 'Military-grade encryption for sensitive data with advanced key management, secure file sharing, and compliance reporting. FIPS 140-2 Level 3 certified.',
        shortDescription: 'Military-grade data encryption solution',
        category: categories['Data Protection']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Data Encryption Tool Military Grade', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'Encryption Dashboard', isPrimary: false }
        ],
        featured: false,
        inStock: true,
        sku: 'DET-MIL-005',
        rating: { average: 4.9, count: 156 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Encryption Standard', 'AES-256, RSA-4096'],
          ['Certification', 'FIPS 140-2 Level 3'],
          ['Key Management', 'Hardware Security Module'],
          ['Compliance', 'GDPR, HIPAA, SOX']
        ]),
        tags: ['encryption', 'military-grade', 'compliance', 'secure']
      },
      {
        name: 'Identity Access Manager Pro',
        price: 449.99,
        description: 'Complete identity and access management solution with SSO capabilities, multi-factor authentication, and privileged access management. Supports SAML, OAuth, and LDAP.',
        shortDescription: 'Enterprise identity and access management',
        category: categories['Identity Management']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Identity Access Manager Pro', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'IAM Control Panel', isPrimary: false }
        ],
        featured: true,
        inStock: true,
        sku: 'IAM-SSO-006',
        rating: { average: 4.7, count: 92 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['SSO Support', 'SAML 2.0, OAuth 2.0, OpenID'],
          ['MFA Methods', '10+ Methods'],
          ['Directory Integration', 'AD, LDAP, Azure AD'],
          ['Users', 'Unlimited']
        ]),
        tags: ['identity', 'access-management', 'sso', 'mfa']
      },
      {
        name: 'Security Monitoring Dashboard Enterprise',
        price: 349.99,
        description: 'Real-time security monitoring and analytics dashboard for enterprise environments. Features customizable alerts, compliance reporting, and threat intelligence integration.',
        shortDescription: 'Enterprise security monitoring solution',
        category: categories['Network Security']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Security Monitoring Dashboard Enterprise', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'Monitoring Analytics', isPrimary: false }
        ],
        featured: false,
        inStock: true,
        sku: 'SMD-RT-007',
        rating: { average: 4.4, count: 78 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Real-time Monitoring', 'Yes'],
          ['Custom Dashboards', 'Unlimited'],
          ['Data Retention', '5 Years'],
          ['API Integration', '100+ Integrations']
        ]),
        tags: ['monitoring', 'dashboard', 'analytics', 'real-time']
      },
      {
        name: 'Mobile Device Security Manager',
        price: 89.99,
        comparePrice: 129.99,
        description: 'Complete mobile device management and security solution. Manages iOS, Android, and Windows devices with app control, data protection, and remote wipe capabilities.',
        shortDescription: 'Complete mobile device security management',
        category: categories['Mobile Security']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Mobile Device Security Manager', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'Mobile Management Console', isPrimary: false }
        ],
        featured: false,
        inStock: true,
        sku: 'MDS-MDM-008',
        rating: { average: 4.3, count: 134 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Supported Platforms', 'iOS, Android, Windows'],
          ['Device Management', 'Unlimited Devices'],
          ['App Store', 'Private App Store'],
          ['Remote Control', 'Full Remote Management']
        ]),
        tags: ['mobile', 'device-management', 'mdm', 'security']
      },
      {
        name: 'Cloud Security Platform',
        price: 799.99,
        description: 'Comprehensive cloud security platform with multi-cloud support, compliance monitoring, and automated threat response. Protects AWS, Azure, and Google Cloud workloads.',
        shortDescription: 'Multi-cloud security platform',
        category: categories['Cloud Security']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Cloud Security Platform', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'Cloud Security Dashboard', isPrimary: false }
        ],
        featured: true,
        inStock: true,
        sku: 'CSP-MC-009',
        rating: { average: 4.8, count: 95 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Cloud Providers', 'AWS, Azure, GCP, Multi-cloud'],
          ['Compliance', 'SOC 2, ISO 27001, PCI DSS'],
          ['Automated Response', 'Yes'],
          ['Workload Protection', 'Containers, Serverless, VMs']
        ]),
        tags: ['cloud', 'multi-cloud', 'compliance', 'automation']
      },
      {
        name: 'Network Access Control System',
        price: 549.99,
        description: 'Advanced network access control with device authentication, policy enforcement, and guest management. Supports 802.1X, MAC-based authentication, and BYOD policies.',
        shortDescription: 'Advanced network access control',
        category: categories['Network Security']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Network Access Control System', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'NAC Policy Manager', isPrimary: false }
        ],
        featured: false,
        inStock: true,
        sku: 'NAC-ADV-010',
        rating: { average: 4.6, count: 88 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Authentication', '802.1X, MAC, Web Portal'],
          ['Device Support', 'All Network Devices'],
          ['Policy Engine', 'Role-based Access Control'],
          ['Guest Management', 'Self-service Portal']
        ]),
        tags: ['network', 'access-control', '802.1x', 'byod']
      },
      {
        name: 'Vulnerability Assessment Scanner',
        price: 299.99,
        description: 'Comprehensive vulnerability assessment and penetration testing tool. Identifies security weaknesses, provides remediation guidance, and generates compliance reports.',
        shortDescription: 'Advanced vulnerability scanner',
        category: categories['Network Security']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Vulnerability Assessment Scanner', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'Vulnerability Reports', isPrimary: false }
        ],
        featured: false,
        inStock: true,
        sku: 'VAS-COMP-011',
        rating: { average: 4.5, count: 112 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Scan Types', 'Network, Web App, Database'],
          ['Vulnerability Database', '100,000+ CVEs'],
          ['Reporting', 'Executive, Technical, Compliance'],
          ['Integration', 'SIEM, Ticketing Systems']
        ]),
        tags: ['vulnerability', 'scanner', 'penetration-testing', 'compliance']
      },
      {
        name: 'Email Security Gateway',
        price: 199.99,
        comparePrice: 249.99,
        description: 'Advanced email security gateway with spam filtering, malware detection, and phishing protection. Features sandboxing technology and email encryption.',
        shortDescription: 'Complete email security solution',
        category: categories['Endpoint Security']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Email Security Gateway', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'Email Security Console', isPrimary: false }
        ],
        featured: true,
        inStock: true,
        sku: 'ESG-ADV-012',
        rating: { average: 4.7, count: 156 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Spam Detection', '99.9% Accuracy'],
          ['Malware Protection', 'Real-time Scanning'],
          ['Sandboxing', 'Advanced Threat Protection'],
          ['Email Encryption', 'S/MIME, PGP Support']
        ]),
        tags: ['email', 'spam-filter', 'malware', 'encryption']
      },
      {
        name: 'Database Security Monitor',
        price: 449.99,
        description: 'Real-time database security monitoring with activity auditing, privilege analysis, and compliance reporting. Supports all major database platforms.',
        shortDescription: 'Database security and compliance monitoring',
        category: categories['Data Protection']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Database Security Monitor', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'Database Audit Reports', isPrimary: false }
        ],
        featured: false,
        inStock: true,
        sku: 'DSM-ENT-013',
        rating: { average: 4.4, count: 73 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Database Support', 'Oracle, SQL Server, MySQL, PostgreSQL'],
          ['Real-time Monitoring', 'Yes'],
          ['Compliance', 'SOX, HIPAA, PCI DSS'],
          ['Threat Detection', 'AI-powered Analytics']
        ]),
        tags: ['database', 'monitoring', 'compliance', 'auditing']
      },
      {
        name: 'Web Application Firewall',
        price: 329.99,
        description: 'Next-generation web application firewall with OWASP Top 10 protection, bot management, and API security. Features machine learning-based threat detection.',
        shortDescription: 'Advanced web application protection',
        category: categories['Network Security']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Web Application Firewall', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'WAF Security Dashboard', isPrimary: false }
        ],
        featured: true,
        inStock: true,
        sku: 'WAF-NG-014',
        rating: { average: 4.6, count: 98 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['OWASP Protection', 'Top 10 + Custom Rules'],
          ['Bot Management', 'Advanced Bot Detection'],
          ['API Security', 'REST, GraphQL, SOAP'],
          ['Performance', '< 1ms Latency']
        ]),
        tags: ['waf', 'web-security', 'owasp', 'api-protection']
      },
      {
        name: 'Backup and Disaster Recovery',
        price: 699.99,
        description: 'Enterprise backup and disaster recovery solution with automated failover, point-in-time recovery, and multi-site replication. Ensures business continuity.',
        shortDescription: 'Enterprise backup and disaster recovery',
        category: categories['Data Protection']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Backup and Disaster Recovery', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'Recovery Management', isPrimary: false }
        ],
        featured: false,
        inStock: true,
        sku: 'BDR-ENT-015',
        rating: { average: 4.8, count: 145 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Recovery Time', '< 15 minutes RTO'],
          ['Recovery Point', '< 1 minute RPO'],
          ['Replication', 'Multi-site Support'],
          ['Automation', 'Fully Automated Failover']
        ]),
        tags: ['backup', 'disaster-recovery', 'business-continuity', 'replication']
      },
      {
        name: 'Security Training Platform',
        price: 249.99,
        description: 'Comprehensive cybersecurity training platform with interactive modules, phishing simulations, and progress tracking. Builds security awareness across organizations.',
        shortDescription: 'Cybersecurity awareness training',
        category: categories['Identity Management']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Security Training Platform', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'Training Analytics', isPrimary: false }
        ],
        featured: false,
        inStock: true,
        sku: 'STP-EDU-016',
        rating: { average: 4.3, count: 187 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Training Modules', '500+ Interactive Modules'],
          ['Phishing Simulation', 'Realistic Attack Scenarios'],
          ['Progress Tracking', 'Detailed Analytics'],
          ['Certifications', 'Industry-recognized Certificates']
        ]),
        tags: ['training', 'education', 'phishing', 'awareness']
      },
      {
        name: 'IoT Security Gateway',
        price: 399.99,
        comparePrice: 499.99,
        description: 'Specialized IoT security gateway with device discovery, traffic analysis, and anomaly detection. Protects industrial and smart building IoT deployments.',
        shortDescription: 'IoT device security gateway',
        category: categories['Network Security']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'IoT Security Gateway', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'IoT Device Management', isPrimary: false }
        ],
        featured: true,
        inStock: true,
        sku: 'ISG-IOT-017',
        rating: { average: 4.5, count: 76 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Device Support', '10,000+ IoT Devices'],
          ['Protocol Support', 'MQTT, CoAP, HTTP, Custom'],
          ['Anomaly Detection', 'ML-based Behavioral Analysis'],
          ['Integration', 'SIEM, Cloud Platforms']
        ]),
        tags: ['iot', 'gateway', 'anomaly-detection', 'industrial']
      },
      {
        name: 'Compliance Management Suite',
        price: 599.99,
        description: 'Comprehensive compliance management suite with automated assessments, policy management, and audit reporting. Supports multiple compliance frameworks.',
        shortDescription: 'Automated compliance management',
        category: categories['Identity Management']._id,
        images: [
          { url: '/placeholder-product.jpg', alt: 'Compliance Management Suite', isPrimary: true },
          { url: '/placeholder-product.jpg', alt: 'Compliance Dashboard', isPrimary: false }
        ],
        featured: false,
        inStock: true,
        sku: 'CMS-COMP-018',
        rating: { average: 4.7, count: 129 },
        createdBy: adminUser._id,
        specifications: new Map([
          ['Frameworks', 'SOC 2, ISO 27001, NIST, GDPR'],
          ['Automated Assessments', 'Continuous Monitoring'],
          ['Policy Management', 'Centralized Policy Engine'],
          ['Audit Reports', 'Real-time Compliance Status']
        ]),
        tags: ['compliance', 'audit', 'policy', 'frameworks']
      }
    ];
    
    console.log(`Inserting ${products.length} products...`);
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully added ${insertedProducts.length} products`);
    
    // Summary
    const totalProducts = await Product.countDocuments();
    const featuredProducts = await Product.countDocuments({ featured: true });
    const totalCategories = await Category.countDocuments();
    
    console.log('\n=== Database Summary ===');
    console.log(`Total Categories: ${totalCategories}`);
    console.log(`Total Products: ${totalProducts}`);
    console.log(`Featured Products: ${featuredProducts}`);
    
    // Show products by category
    for (const [catName, catObj] of Object.entries(categories)) {
      const productCount = await Product.countDocuments({ category: catObj._id });
      console.log(`${catName}: ${productCount} products`);
    }
    
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedAllProducts();
