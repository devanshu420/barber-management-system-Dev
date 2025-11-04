const crypto = require("crypto")

const algorithm = "aes-256-gcm"
const secretKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32)

// Encrypt sensitive data
exports.encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(algorithm, secretKey, iv)

    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    const authTag = cipher.getAuthTag()

    return {
      encrypted,
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex"),
    }
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Encryption failed")
  }
}

// Decrypt sensitive data
exports.decrypt = (encryptedData) => {
  try {
    const { encrypted, iv, authTag } = encryptedData

    const decipher = crypto.createDecipher(algorithm, secretKey, Buffer.from(iv, "hex"))
    decipher.setAuthTag(Buffer.from(authTag, "hex"))

    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Decryption failed")
  }
}

// Hash sensitive data (one-way)
exports.hash = (data) => {
  return crypto.createHash("sha256").update(data).digest("hex")
}

// Generate secure random string
exports.generateSecureRandom = (length = 32) => {
  return crypto.randomBytes(length).toString("hex")
}
