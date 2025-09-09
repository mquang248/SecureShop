// Vercel serverless function wrapper for Express.js backend
const path = require('path')

// Add backend directory to require path
const backendPath = path.join(__dirname, '..', 'backend')
require('module').globalPaths.push(backendPath)

// Set working directory to backend
process.chdir(backendPath)

// Import and export the Express app
const app = require('../backend/server.js')

module.exports = app
