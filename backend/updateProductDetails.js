const mongoose = require('mongoose')
require('dotenv').config()
const Product = require('./models/Product')

const productUpdates = {
  "68befafd2c339d20b9f896e7": { // ShieldLock X1 - ID 7
    features: [
      "Multi-layered DDoS protection",
      "Real-time threat detection",
      "Advanced firewall configuration", 
      "24/7 network monitoring",
      "Automated incident response"
    ],
    specifications: {
      "Protection Type": "Network Firewall",
      "Max Throughput": "10 Gbps",
      "Concurrent Connections": "100,000",
      "Security Protocols": "SSL/TLS, IPSec, HTTPS",
      "Management": "Web-based console",
      "Dimensions": "19\" x 12\" x 2\"",
      "Power Consumption": "45W",
      "Warranty": "3 years"
    }
  },
  "68befafd2c339d20b9f896e3": { // VaultPass Pro - ID 6
    features: [
      "Military-grade password encryption",
      "Biometric authentication support",
      "Cross-platform synchronization",
      "Secure password sharing",
      "Advanced breach monitoring"
    ],
    specifications: {
      "Encryption": "AES-256",
      "Supported Platforms": "Windows, macOS, iOS, Android",
      "Password Vault": "Unlimited storage",
      "Two-Factor Auth": "TOTP, SMS, Email",
      "Secure Sharing": "Time-limited links",
      "Emergency Access": "Yes",
      "Family Plan": "Up to 6 users",
      "Support": "24/7 priority"
    }
  },
  "68befafd2c339d20b9f896e5": { // QuantumVPN Cube - ID 5
    features: [
      "Quantum-encrypted VPN tunnels",
      "Zero-log privacy policy",
      "Global server network (50+ countries)",
      "Split tunneling technology",
      "Kill switch protection"
    ],
    specifications: {
      "Encryption": "Quantum-resistant algorithms",
      "Server Count": "3000+ servers",
      "Countries": "50+ locations",
      "Simultaneous Connections": "10 devices",
      "Bandwidth": "Unlimited",
      "Protocols": "WireGuard, OpenVPN, IKEv2",
      "Kill Switch": "System-level protection",
      "DNS Protection": "Built-in ad blocker"
    }
  },
  "68befafd2c339d20b9f896e7": { // BioKey Ultra - ID 4  
    features: [
      "Fingerprint + voice recognition",
      "Hardware security module",
      "Enterprise SSO integration",
      "FIDO2 compliance",
      "Contactless authentication"
    ],
    specifications: {
      "Biometric Types": "Fingerprint, Voice, Face",
      "Storage": "10,000 templates",
      "Authentication Speed": "<1 second",
      "Connectivity": "USB-C, Bluetooth 5.0",
      "Battery Life": "6 months typical use",
      "Certifications": "FIDO2, Common Criteria",
      "Dimensions": "85mm x 54mm x 5mm",
      "Weight": "45g"
    }
  },
  "68befafd2c339d20b9f896e9": { // SafeComm Headset - ID 3
    features: [
      "End-to-end encrypted communications",
      "Military-grade audio security", 
      "Noise cancellation technology",
      "Secure conference calling",
      "Anti-eavesdropping protection"
    ],
    specifications: {
      "Audio Encryption": "AES-256",
      "Frequency Response": "20Hz - 20kHz",
      "Noise Cancellation": "Active, -35dB",
      "Battery Life": "25 hours talk time",
      "Connectivity": "Bluetooth 5.2, USB-C",
      "Range": "100m line of sight",
      "Weight": "280g",
      "Certification": "Military MIL-STD-810G"
    }
  },
  "68befafd2c339d20b9f896eb": { // CyberEye Monitor - ID 2
    features: [
      "AI-powered threat visualization",
      "Real-time network mapping",
      "Anomaly detection algorithms",
      "Automated alert system",
      "Forensic analysis tools"
    ],
    specifications: {
      "Display": "27\" 4K IPS",
      "Resolution": "3840 x 2160",
      "Refresh Rate": "60Hz",
      "Network Monitoring": "Up to 10Gbps",
      "Threat Detection": "AI/ML powered",
      "Data Retention": "90 days default",
      "Connectivity": "HDMI, USB-C, Ethernet",
      "Power": "65W"
    }
  },
  "68befafd2c339d20b9f896ed": { // DarkTrace Mini - ID 1
    features: [
      "Autonomous threat hunting",
      "Machine learning detection",
      "Behavioral analytics",
      "Instant threat response",
      "Cloud-based intelligence"
    ],
    specifications: {
      "AI Engine": "Cyber AI Analyst",
      "Network Coverage": "Up to 1000 devices",
      "Detection Types": "Malware, Insider threats, APTs",
      "Response Time": "<1 minute",
      "Deployment": "Plug and play",
      "Connectivity": "Gigabit Ethernet",
      "Dimensions": "200mm x 150mm x 50mm",
      "Power": "12V DC adapter"
    }
  },
  "68befafd2c339d20b9f896ef": { // CryptoVault Stick - ID 12
    features: [
      "Hardware encrypted storage",
      "Self-destruct mechanism", 
      "Biometric access control",
      "Water and shock resistant",
      "Cross-platform compatibility"
    ],
    specifications: {
      "Capacity": "128GB",
      "Encryption": "AES-256 XTS",
      "Interface": "USB 3.2 Gen 1",
      "Biometric": "Fingerprint sensor",
      "Operating Temp": "-20°C to +70°C",
      "Water Resistance": "IP68",
      "Dimensions": "78mm x 21mm x 9mm",
      "Weight": "20g"
    }
  },
  "68befafd2c339d20b9f896f1": { // PhishBlocker Pro - ID 11
    features: [
      "Advanced email threat detection",
      "URL reputation analysis",
      "Sandboxing technology",
      "User awareness training",
      "Incident response automation"
    ],
    specifications: {
      "Email Protection": "Advanced threat protection",
      "URL Analysis": "Real-time scanning",
      "Sandbox": "Zero-day protection",
      "User Training": "Simulated phishing",
      "Reporting": "Executive dashboards",
      "Integration": "Office 365, G Suite",
      "Deployment": "Cloud-based",
      "Response Time": "Real-time"
    }
  },
  "68befafd2c339d20b9f896f3": { // SafeCall Shield - ID 10
    features: [
      "Encrypted voice communications",
      "Call authentication",
      "Anti-spoofing protection", 
      "Secure conferencing",
      "Call recording encryption"
    ],
    specifications: {
      "Voice Encryption": "SRTP/ZRTP",
      "Authentication": "PKI-based",
      "Protocols": "SIP, RTP, TLS",
      "Call Quality": "HD Voice",
      "Conferencing": "Up to 100 participants",
      "Recording": "Encrypted storage",
      "Compliance": "HIPAA, SOX, PCI-DSS",
      "Deployment": "On-premise/Cloud"
    }
  },
  "68befafd2c339d20b9f896f5": { // ZeroTrace Drive - ID 9
    features: [
      "Complete data anonymization",
      "Secure file shredding",
      "Hidden volume creation",
      "Plausible deniability",
      "Multi-layer encryption"
    ],
    specifications: {
      "Capacity": "2TB",
      "Encryption": "AES-256 + Serpent + Twofish",
      "Hidden Volumes": "Multiple levels",
      "Interface": "USB 3.1 Type-C",
      "Shredding": "DoD 5220.22-M standard",
      "OS Support": "Windows, macOS, Linux",
      "Form Factor": "Portable SSD",
      "Transfer Speed": "Up to 540 MB/s"
    }
  },
  "68befafd2c339d20b9f896f7": { // Guardian Watch - ID 8
    features: [
      "Continuous security monitoring",
      "Biometric health tracking",
      "Emergency alert system",
      "Location-based security",
      "Encrypted communications"
    ],
    specifications: {
      "Display": "1.4\" AMOLED",
      "Battery Life": "7 days typical",
      "Water Resistance": "5ATM",
      "Connectivity": "4G LTE, WiFi, Bluetooth",
      "Biometrics": "Heart rate, SpO2",
      "GPS": "Multi-constellation",
      "Storage": "8GB internal",
      "Charging": "Wireless Qi"
    }
  },
  "68bf07841c3f92c465f10c94": { // SecureWifi Manager Pro - ID 13
    features: [
      "Enterprise WiFi security",
      "Zero-trust network access",
      "Automated threat response",
      "Guest network isolation",
      "Advanced encryption protocols"
    ],
    specifications: {
      "WiFi Standards": "802.11ax (WiFi 6)",
      "Security": "WPA3-Enterprise",
      "Throughput": "Up to 6 Gbps",
      "Concurrent Users": "500+",
      "Management": "Cloud-based controller",
      "Coverage": "Up to 5000 sqm",
      "Power": "PoE+ 802.3at",
      "Antennas": "8x8 MIMO"
    }
  },
  "68bf07841c3f92c465f10c95": { // DataGuard Backup Shield - ID 15
    features: [
      "Automated encrypted backups",
      "Ransomware protection",
      "Point-in-time recovery",
      "Cross-platform support",
      "Cloud and local storage"
    ],
    specifications: {
      "Backup Types": "Full, Incremental, Differential",
      "Encryption": "AES-256",
      "Compression": "Up to 90% reduction",
      "Storage": "Cloud + Local hybrid",
      "Recovery Time": "Minutes (RTO)",
      "Recovery Point": "15-minute RPO",
      "Supported OS": "Windows, macOS, Linux",
      "Capacity": "Unlimited cloud storage"
    }
  },
  "68bf07841c3f92c465f10c96": { // ThreatHunter AI Platform - ID 14
    features: [
      "AI-powered threat hunting",
      "Behavioral analysis engine",
      "Threat intelligence integration",
      "Automated investigation",
      "Predictive security analytics"
    ],
    specifications: {
      "AI Engine": "Deep learning neural networks",
      "Data Processing": "Real-time stream processing",
      "Threat Intel": "100+ integrated sources",
      "Investigation": "Automated playbooks",
      "Analytics": "Predictive modeling",
      "Deployment": "On-premise/Cloud/Hybrid",
      "Scalability": "Petabyte-scale",
      "Response Time": "Sub-second detection"
    }
  },
  "68bf07841c3f92c465f10c99": { // SecureCloud Gateway - ID 16
    features: [
      "Cloud access security broker",
      "Data loss prevention",
      "Shadow IT discovery",
      "Compliance monitoring",
      "Zero-trust cloud access"
    ],
    specifications: {
      "Cloud Apps": "5000+ supported",
      "Data Protection": "DLP + CASB",
      "Deployment": "Agent-based + Agentless",
      "API Coverage": "300+ cloud services",
      "Compliance": "SOC2, ISO27001, GDPR",
      "Threat Protection": "Advanced malware detection",
      "Bandwidth": "Unlimited",
      "SLA": "99.99% uptime"
    }
  },
  "68bf07841c3f92c465f10c98": { // CloudAccess Identity Hub - ID 17
    features: [
      "Single sign-on (SSO)",
      "Multi-factor authentication",
      "Identity governance",
      "Privileged access management",
      "User behavior analytics"
    ],
    specifications: {
      "SSO Support": "SAML, OAuth, OpenID",
      "MFA Methods": "Push, SMS, TOTP, Biometric",
      "Applications": "5000+ pre-integrated",
      "Directory Sync": "AD, LDAP, Azure AD",
      "Provisioning": "Automated lifecycle",
      "Compliance": "SOX, PCI-DSS, HIPAA",
      "API": "RESTful APIs",
      "Availability": "99.9% SLA"
    }
  },
  "68bf07841c3f92c465f10c97": { // MobileSecure Endpoint Agent - ID 18
    features: [
      "Mobile device management",
      "Application security scanning",
      "Data encryption and wiping",
      "Compliance monitoring",
      "Remote threat remediation"
    ],
    specifications: {
      "Supported OS": "iOS, Android, Windows Mobile",
      "Management": "Cloud-based console",
      "Encryption": "AES-256 device encryption",
      "App Security": "Real-time scanning",
      "Compliance": "GDPR, HIPAA, SOX",
      "Remote Actions": "Lock, wipe, locate",
      "Battery Impact": "Minimal (<2%)",
      "Deployment": "OTA or app store"
    }
  }
}

async function updateProducts() {
  try {
    console.log('🔄 Connecting to database...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    let updated = 0
    let errors = 0

    for (const [productId, updates] of Object.entries(productUpdates)) {
      try {
        const result = await Product.findByIdAndUpdate(
          productId,
          {
            $set: {
              features: updates.features,
              specifications: updates.specifications
            }
          },
          { new: true }
        )

        if (result) {
          console.log(`✅ Updated: ${result.name}`)
          updated++
        } else {
          console.log(`❌ Not found: ${productId}`)
          errors++
        }
      } catch (error) {
        console.log(`❌ Error updating ${productId}:`, error.message)
        errors++
      }
    }

    console.log(`\n📊 Update Summary:`)
    console.log(`✅ Successfully updated: ${updated} products`)
    console.log(`❌ Errors: ${errors}`)
    
    console.log('\n🔍 Verifying updates...')
    const productsWithFeatures = await Product.countDocuments({ 
      features: { $exists: true, $ne: null, $not: { $size: 0 } }
    })
    const productsWithSpecs = await Product.countDocuments({ 
      specifications: { $exists: true, $ne: null }
    })
    
    console.log(`📦 Products with features: ${productsWithFeatures}/18`)
    console.log(`📋 Products with specifications: ${productsWithSpecs}/18`)
    
  } catch (error) {
    console.error('❌ Database connection error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from database')
  }
}

updateProducts()
