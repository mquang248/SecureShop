// Simple products API for Vercel
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Mock products data for testing
  const products = [
    {
      _id: "1",
      name: "Advanced Firewall System",
      price: 299.99,
      description: "Professional-grade firewall with AI threat detection",
      category: "Network Security",
      image: "/placeholder-product.jpg",
      featured: true,
      features: ["AI-powered threat detection", "Real-time monitoring", "Cloud integration"],
      specifications: {
        "Throughput": "10 Gbps",
        "Supported Protocols": "HTTP/HTTPS, FTP, SSH",
        "Operating System": "Linux-based"
      }
    },
    {
      _id: "2",
      name: "Enterprise VPN Gateway",
      price: 599.99,
      description: "Secure VPN gateway for enterprise networks",
      category: "Network Security",
      image: "/placeholder-product.jpg",
      featured: true,
      features: ["Site-to-site VPN", "Remote access VPN", "Multi-protocol support"],
      specifications: {
        "Concurrent Users": "500",
        "Encryption": "AES-256",
        "Protocols": "IPSec, SSL/TLS"
      }
    }
  ];

  if (req.url.includes('/featured')) {
    const featuredProducts = products.filter(p => p.featured);
    res.status(200).json(featuredProducts);
  } else {
    res.status(200).json(products);
  }
}
