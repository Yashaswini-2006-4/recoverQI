const crypto = require("crypto");

/**
 * Calculate the SHA-256 hash of a Buffer.
 */
function calculateSHA256(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError("Input must be a Buffer");
  }

  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");
}

/**
 * Verify a Buffer against a trusted SHA-256 hash.
 */
function verifySHA256(buffer, expectedHash) {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError("Input must be a Buffer");
  }

  if (typeof expectedHash !== "string") {
    throw new TypeError("Expected hash must be a string");
  }

  const normalizedHash = expectedHash.trim().toLowerCase();

  if (!/^[a-f0-9]{64}$/.test(normalizedHash)) {
    throw new Error("Invalid SHA-256 hash format");
  }

  const actualHash = calculateSHA256(buffer);

  return {
    actualHash,
    expectedHash: normalizedHash,
    verified: actualHash === normalizedHash
  };
}

module.exports = {
  calculateSHA256,
  verifySHA256
};