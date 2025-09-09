// Featured products API endpoint for Vercel
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Mock featured products data
    const featuredProducts = [
      {
        _id: "674a1b2c3d4e5f6789abcdef",
        name: "Advanced Firewall System",
        price: 299.99,
        description: "Professional-grade firewall with AI threat detection and real-time monitoring capabilities.",
        category: "Network Security",
        image: "/placeholder-product.jpg",
        featured: true,
        inStock: true,
        stockQuantity: 15,
        features: [
          "AI-powered threat detection",
          "Real-time monitoring",
          "Cloud integration",
          "24/7 automated response"
        ],
        specifications: {
          "Throughput": "10 Gbps",
          "Supported Protocols": "HTTP/HTTPS, FTP, SSH",
          "Operating System": "Linux-based",
          "Memory": "8GB RAM",
          "Storage": "256GB SSD"
        }
      },
      {
        _id: "674a1b2c3d4e5f6789abcd10",
        name: "Enterprise VPN Gateway",
        price: 599.99,
        description: "Secure VPN gateway for enterprise networks with multi-protocol support.",
        category: "Network Security",
        image: "/placeholder-product.jpg",
        featured: true,
        inStock: true,
        stockQuantity: 8,
        features: [
          "Site-to-site VPN",
          "Remote access VPN",
          "Multi-protocol support",
          "High availability clustering"
        ],
        specifications: {
          "Concurrent Users": "500",
          "Encryption": "AES-256",
          "Protocols": "IPSec, SSL/TLS",
          "Bandwidth": "1 Gbps",
          "Redundancy": "Active-Passive"
        }
      }
    ];

    res.status(200).json(featuredProducts);
  } catch (error) {
    console.error('Error in featured products API:', error);
    res.status(500).json({ 
      error: 'Failed to fetch featured products', 
      details: error.message 
    });
  }
}
