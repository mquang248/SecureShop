// Featured products API for Vercel
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Mock featured products data
  const featuredProducts = [
    {
      _id: "67650a8b123456789012345a",
      name: "Advanced Firewall System",
      price: 299.99,
      description: "Professional-grade firewall with AI threat detection and real-time monitoring capabilities",
      category: {
        _id: "67650a8b123456789012345f",
        name: "Network Security"
      },
      image: "/placeholder-product.jpg",
      featured: true,
      inStock: true,
      sku: "FW-ADV-001",
      features: [
        "AI-powered threat detection",
        "Real-time monitoring dashboard",
        "Cloud integration support",
        "Automated threat response",
        "Advanced logging and analytics"
      ],
      specifications: {
        "Throughput": "10 Gbps",
        "Supported Protocols": "HTTP/HTTPS, FTP, SSH, SFTP",
        "Operating System": "Linux-based",
        "Memory": "16 GB RAM",
        "Storage": "1 TB SSD",
        "Network Interfaces": "8x 1GbE, 2x 10GbE"
      },
      rating: 4.8,
      reviewCount: 124,
      tags: ["firewall", "security", "AI", "enterprise"]
    },
    {
      _id: "67650a8b123456789012345b", 
      name: "Enterprise VPN Gateway",
      price: 599.99,
      description: "Secure VPN gateway solution for enterprise networks with multi-protocol support",
      category: {
        _id: "67650a8b123456789012345f",
        name: "Network Security"
      },
      image: "/placeholder-product.jpg",
      featured: true,
      inStock: true,
      sku: "VPN-ENT-002",
      features: [
        "Site-to-site VPN connectivity",
        "Remote access VPN support",
        "Multi-protocol support",
        "Load balancing capabilities",
        "Centralized management console"
      ],
      specifications: {
        "Concurrent Users": "500",
        "Encryption": "AES-256, RSA-4096",
        "Protocols": "IPSec, SSL/TLS, OpenVPN",
        "Bandwidth": "2 Gbps",
        "Authentication": "LDAP, RADIUS, Multi-factor",
        "High Availability": "Active-Passive clustering"
      },
      rating: 4.7,
      reviewCount: 89,
      tags: ["vpn", "gateway", "enterprise", "secure"]
    }
  ];

  res.status(200).json(featuredProducts);
}
