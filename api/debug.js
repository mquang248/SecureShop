module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Return debug info about the API
  res.status(200).json({ 
    message: 'API Debug Info',
    timestamp: new Date().toISOString(),
    environment: 'production',
    availableEndpoints: [
      '/api/test',
      '/api/debug',
      '/api/products',
      '/api/products/featured',
      '/api/products/categories',
      '/api/products/[id]'
    ],
    requestInfo: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query
    }
  });
}
