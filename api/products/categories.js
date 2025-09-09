// Products categories API for Vercel
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Mock categories data
  const categories = [
    {
      _id: "67650a8b123456789012345f",
      name: "Network Security",
      description: "Firewalls, VPNs, and network protection solutions",
      productCount: 8
    },
    {
      _id: "67650a8b123456789012346a",
      name: "Endpoint Security",
      description: "Antivirus, anti-malware, and endpoint protection",
      productCount: 6
    },
    {
      _id: "67650a8b123456789012346b",
      name: "Data Protection",
      description: "Encryption, backup, and data security solutions",
      productCount: 4
    },
    {
      _id: "67650a8b123456789012346c",
      name: "Identity Management",
      description: "Authentication, authorization, and access control",
      productCount: 2
    }
  ];

  res.status(200).json(categories);
}
