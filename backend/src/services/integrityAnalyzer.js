const crypto = require("crypto");

const FILE_SIGNATURES = {
  PDF: [
    {
      bytes: Buffer.from("%PDF-", "ascii"),
      offset: 0,
    },
  ],

  PNG: [
    {
      bytes: Buffer.from([
        0x89, 0x50, 0x4e, 0x47,
        0x0d, 0x0a, 0x1a, 0x0a,
      ]),
      offset: 0,
    },
  ],

  JPEG: [
    {
      bytes: Buffer.from([0xff, 0xd8, 0xff]),
      offset: 0,
    },
  ],

  GIF: [
    {
      bytes: Buffer.from("GIF87a", "ascii"),
      offset: 0,
    },
    {
      bytes: Buffer.from("GIF89a", "ascii"),
      offset: 0,
    },
  ],

  ZIP: [
    {
      bytes: Buffer.from([0x50, 0x4b, 0x03, 0x04]),
      offset: 0,
    },
    {
      bytes: Buffer.from([0x50, 0x4b, 0x05, 0x06]),
      offset: 0,
    },
    {
      bytes: Buffer.from([0x50, 0x4b, 0x07, 0x08]),
      offset: 0,
    },
  ],

  EXE: [
    {
      bytes: Buffer.from([0x4d, 0x5a]),
      offset: 0,
    },
  ],
};

function detectFileFormat(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError("File content must be a Buffer");
  }

  for (const [format, signatures] of Object.entries(FILE_SIGNATURES)) {
    for (const signature of signatures) {
      const { bytes, offset } = signature;

      if (
        buffer.length >= offset + bytes.length &&
        buffer.subarray(offset, offset + bytes.length).equals(bytes)
      ) {
        return format;
      }
    }
  }

  return "UNKNOWN";
}

function calculateSHA256(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError("File content must be a Buffer");
  }

  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function analyzeFileIntegrity(buffer, expectedFormat = null) {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError("File content must be a Buffer");
  }

  const detectedFormat = detectFileFormat(buffer);
  const sha256 = calculateSHA256(buffer);

  const normalizedExpectedFormat = expectedFormat
    ? expectedFormat.toUpperCase()
    : null;

  const formatMatches = normalizedExpectedFormat
    ? detectedFormat === normalizedExpectedFormat
    : null;

  return {
    sha256,
    detectedFormat,
    expectedFormat: normalizedExpectedFormat,
    formatMatches,
    fileSize: buffer.length,
    isEmpty: buffer.length === 0,
    status:
      buffer.length === 0
        ? "EMPTY"
        : detectedFormat === "UNKNOWN"
          ? "UNKNOWN_FORMAT"
          : formatMatches === false
            ? "FORMAT_MISMATCH"
            : "SIGNATURE_VALID",
  };
}

module.exports = {
  detectFileFormat,
  calculateSHA256,
  analyzeFileIntegrity,
};