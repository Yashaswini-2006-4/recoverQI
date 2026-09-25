const {
  detectFileFormat,
  calculateSHA256,
  analyzeFileIntegrity,
} = require("./integrityAnalyzer");

describe("RecoverIQ Integrity Analyzer", () => {
  test("detects a PDF file", () => {
    const buffer = Buffer.from("%PDF-1.7 example", "ascii");

    expect(detectFileFormat(buffer)).toBe("PDF");
  });

  test("detects a PNG file", () => {
    const buffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47,
      0x0d, 0x0a, 0x1a, 0x0a,
    ]);

    expect(detectFileFormat(buffer)).toBe("PNG");
  });

  test("detects a JPEG file", () => {
    const buffer = Buffer.from([0xff, 0xd8, 0xff, 0x00]);

    expect(detectFileFormat(buffer)).toBe("JPEG");
  });

  test("returns UNKNOWN for an unsupported signature", () => {
    const buffer = Buffer.from("random content", "ascii");

    expect(detectFileFormat(buffer)).toBe("UNKNOWN");
  });

  test("calculates a SHA-256 hash", () => {
    const buffer = Buffer.from("hello", "utf8");

    expect(calculateSHA256(buffer)).toBe(
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
    );
  });

  test("reports a matching expected format", () => {
    const buffer = Buffer.from("%PDF-1.7 example", "ascii");

    const result = analyzeFileIntegrity(buffer, "PDF");

    expect(result.detectedFormat).toBe("PDF");
    expect(result.formatMatches).toBe(true);
    expect(result.status).toBe("SIGNATURE_VALID");
  });

  test("reports a format mismatch", () => {
    const buffer = Buffer.from("%PDF-1.7 example", "ascii");

    const result = analyzeFileIntegrity(buffer, "PNG");

    expect(result.formatMatches).toBe(false);
    expect(result.status).toBe("FORMAT_MISMATCH");
  });

  test("handles an empty file", () => {
    const result = analyzeFileIntegrity(Buffer.alloc(0));

    expect(result.isEmpty).toBe(true);
    expect(result.status).toBe("EMPTY");
  });

  test("rejects non-Buffer input", () => {
    expect(() => analyzeFileIntegrity("not a buffer")).toThrow(
      "File content must be a Buffer"
    );
  });
});