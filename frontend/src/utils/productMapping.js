// Mapping from MongoDB ObjectId to sequential numbers 1-18 for product pages
export const productIdMapping = {
  "68c05d54feb6d22fdac86064": 1,  // Advanced Firewall System Pro
  "68c05d54feb6d22fdac86077": 2,  // Security Monitoring Dashboard Enterprise
  "68c05d54feb6d22fdac86074": 3,  // Identity Access Manager Pro
  "68c05d54feb6d22fdac86071": 4,  // Data Encryption Tool Military Grade
  "68c05d54feb6d22fdac8606e": 5,  // Endpoint Protection Suite Ultimate
  "68c05d54feb6d22fdac8606b": 6,  // Intrusion Detection System AI
  "68c05d54feb6d22fdac86068": 7,  // Enterprise VPN Gateway Elite
  "68c05d54feb6d22fdac86092": 8,  // Security Training Platform
  "68c05d54feb6d22fdac8608f": 9,  // Backup and Disaster Recovery
  "68c05d54feb6d22fdac8608c": 10, // Web Application Firewall
  "68c05d54feb6d22fdac86089": 11, // Database Security Monitor
  "68c05d54feb6d22fdac86086": 12, // Email Security Gateway
  "68c05d54feb6d22fdac86083": 13, // Vulnerability Assessment Scanner
  "68c05d54feb6d22fdac86080": 14, // Network Access Control System
  "68c05d54feb6d22fdac8607d": 15, // Cloud Security Platform
  "68c05d54feb6d22fdac8607a": 16, // Mobile Device Security Manager
  "68c05d54feb6d22fdac86098": 17, // Compliance Management Suite
  "68c05d54feb6d22fdac86095": 18  // IoT Security Gateway
}

// Function to get product page number from MongoDB ID
export const getProductPageNumber = (mongoId) => {
  return productIdMapping[mongoId] || null
}

// Function to get product URL
export const getProductUrl = (mongoId) => {
  const pageNumber = getProductPageNumber(mongoId)
  return pageNumber ? `/shop/${pageNumber}` : `/shop/${mongoId}`
}
