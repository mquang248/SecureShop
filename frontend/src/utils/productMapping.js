// Mapping from MongoDB ObjectId to sequential numbers 1-18 for product pages
export const productIdMapping = {
  "68befafd2c339d20b9f896ed": 1,  // DarkTrace Mini
  "68befafd2c339d20b9f896eb": 2,  // CyberEye Monitor
  "68befafd2c339d20b9f896e9": 3,  // SafeComm Headset
  "68befafd2c339d20b9f896e7": 4,  // BioKey Ultra
  "68befafd2c339d20b9f896e5": 5,  // QuantumVPN Cube
  "68befafd2c339d20b9f896e3": 6,  // VaultPass Pro
  "68befafd2c339d20b9f896e1": 7,  // ShieldLock X1
  "68befafd2c339d20b9f896f7": 8,  // Guardian Watch
  "68befafd2c339d20b9f896f5": 9,  // ZeroTrace Drive
  "68befafd2c339d20b9f896f3": 10, // SafeCall Shield
  "68befafd2c339d20b9f896f1": 11, // PhishBlocker Pro
  "68befafd2c339d20b9f896ef": 12, // CryptoVault Stick
  "68bf07841c3f92c465f10c94": 13, // SecureWifi Manager Pro
  "68bf07841c3f92c465f10c96": 14, // ThreatHunter AI Platform
  "68bf07841c3f92c465f10c95": 15, // DataGuard Backup Shield
  "68bf07841c3f92c465f10c99": 16, // SecureCloud Gateway
  "68bf07841c3f92c465f10c98": 17, // CloudAccess Identity Hub
  "68bf07841c3f92c465f10c97": 18  // MobileSecure Endpoint Agent
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
