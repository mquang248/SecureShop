// Individual product API for Vercel
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get product ID from URL
  const url = new URL(req.url, 'http://localhost');
  const pathParts = url.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];

  // Mock product data with all details
  const products = {
    "67650a8b123456789012345a": {
      _id: "67650a8b123456789012345a",
      name: "Advanced Firewall System",
      price: 299.99,
      description: "Professional-grade firewall with AI threat detection and real-time monitoring capabilities. This state-of-the-art security solution provides comprehensive network protection for enterprise environments.",
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
        "Advanced logging and analytics",
        "Multi-layered security architecture",
        "High-performance packet inspection",
        "Customizable security policies"
      ],
      specifications: {
        "Throughput": "10 Gbps",
        "Supported Protocols": "HTTP/HTTPS, FTP, SSH, SFTP, SMTP",
        "Operating System": "Linux-based",
        "Memory": "16 GB RAM",
        "Storage": "1 TB SSD",
        "Network Interfaces": "8x 1GbE, 2x 10GbE",
        "Power Consumption": "150W",
        "Dimensions": "19\" x 12\" x 2U",
        "Temperature Range": "0°C to 40°C",
        "Humidity": "10% to 90% non-condensing"
      },
      rating: 4.8,
      reviewCount: 124,
      tags: ["firewall", "security", "AI", "enterprise"],
      warranty: "3 years",
      returnPolicy: "30 days",
      shipping: {
        weight: "5.2 kg",
        dimensions: "50cm x 35cm x 10cm",
        freeShipping: true
      }
    },
    "67650a8b123456789012345b": {
      _id: "67650a8b123456789012345b",
      name: "Enterprise VPN Gateway",
      price: 599.99,
      description: "Secure VPN gateway solution for enterprise networks with multi-protocol support and advanced authentication features. Designed for high-availability environments.",
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
        "Centralized management console",
        "High-availability clustering",
        "Advanced authentication methods",
        "Bandwidth optimization"
      ],
      specifications: {
        "Concurrent Users": "500",
        "Encryption": "AES-256, RSA-4096",
        "Protocols": "IPSec, SSL/TLS, OpenVPN, WireGuard",
        "Bandwidth": "2 Gbps",
        "Authentication": "LDAP, RADIUS, Multi-factor",
        "High Availability": "Active-Passive clustering",
        "Memory": "32 GB RAM",
        "Storage": "500 GB SSD",
        "Network Interfaces": "4x 1GbE, 2x 10GbE"
      },
      rating: 4.7,
      reviewCount: 89,
      tags: ["vpn", "gateway", "enterprise", "secure"],
      warranty: "5 years",
      returnPolicy: "30 days",
      shipping: {
        weight: "7.8 kg",
        dimensions: "55cm x 40cm x 12cm",
        freeShipping: true
      }
    }
  };

  const product = products[productId];
  
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const response = {
    success: true,
    data: product
  };

  res.status(200).json(response);
}
