// Main products API for Vercel
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Mock products data
  const allProducts = [
    {
      _id: "67650a8b123456789012345a",
      name: "Advanced Firewall System",
      price: 299.99,
      description: "Professional-grade firewall with AI threat detection",
      category: {
        _id: "67650a8b123456789012345f",
        name: "Network Security"
      },
      image: "/placeholder-product.jpg",
      featured: true,
      inStock: true,
      sku: "FW-ADV-001",
      rating: 4.8,
      reviewCount: 124
    },
    {
      _id: "67650a8b123456789012345b",
      name: "Enterprise VPN Gateway", 
      price: 599.99,
      description: "Secure VPN gateway for enterprise networks",
      category: {
        _id: "67650a8b123456789012345f",
        name: "Network Security"
      },
      image: "/placeholder-product.jpg",
      featured: true,
      inStock: true,
      sku: "VPN-ENT-002",
      rating: 4.7,
      reviewCount: 89
    },
    {
      _id: "67650a8b123456789012345c",
      name: "Intrusion Detection System",
      price: 399.99,
      description: "Advanced IDS with machine learning capabilities",
      category: {
        _id: "67650a8b123456789012345f",
        name: "Network Security"
      },
      image: "/placeholder-product.jpg",
      featured: false,
      inStock: true,
      sku: "IDS-ML-003",
      rating: 4.6,
      reviewCount: 67
    },
    {
      _id: "67650a8b123456789012345d",
      name: "Endpoint Protection Suite",
      price: 149.99,
      description: "Comprehensive endpoint security solution",
      category: {
        _id: "67650a8b123456789012346a",
        name: "Endpoint Security"
      },
      image: "/placeholder-product.jpg",
      featured: false,
      inStock: true,
      sku: "EPS-COMP-004",
      rating: 4.5,
      reviewCount: 203
    },
    {
      _id: "67650a8b123456789012345e",
      name: "Data Encryption Tool",
      price: 199.99,
      description: "Military-grade encryption for sensitive data",
      category: {
        _id: "67650a8b123456789012346b",
        name: "Data Protection"
      },
      image: "/placeholder-product.jpg",
      featured: false,
      inStock: true,
      sku: "DET-MIL-005",
      rating: 4.9,
      reviewCount: 156
    }
  ];

  // Parse query parameters
  const url = new URL(req.url, 'http://localhost');
  const searchParams = url.searchParams;
  
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 12;
  const search = searchParams.get('search');
  const category = searchParams.get('category');
  const sort = searchParams.get('sort') || '-createdAt';

  let filteredProducts = [...allProducts];

  // Apply search filter
  if (search) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply category filter
  if (category) {
    filteredProducts = filteredProducts.filter(product =>
      product.category._id === category
    );
  }

  // Apply sorting
  if (sort === '-createdAt') {
    // Default sort (keep original order)
  } else if (sort === 'price') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === '-price') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'name') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const response = {
    success: true,
    data: {
      products: paginatedProducts,
      totalProducts: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit),
      currentPage: page,
      hasNext: endIndex < filteredProducts.length,
      hasPrev: page > 1
    }
  };

  res.status(200).json(response);
}
