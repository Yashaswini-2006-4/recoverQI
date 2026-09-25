const {
  calculateSHA256,
  verifySHA256
} = require("./hashing");

describe("SHA-256 hashing", () => {
  test("calculates a valid SHA-256 hash", () => {
    const buffer = Buffer.from("RecoverIQ");

    const hash = calculateSHA256(buffer);

    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  test("verifies an unchanged file", () => {
    const buffer = Buffer.from("RecoverIQ original file");

    const hash = calculateSHA256(buffer);

    const result = verifySHA256(buffer, hash);

    expect(result.verified).toBe(true);
  });

  test("detects modified file contents", () => {
    const original = Buffer.from("Original file");
    const modified = Buffer.from("Modified file");

    const originalHash = calculateSHA256(original);

    const result = verifySHA256(modified, originalHash);

    expect(result.verified).toBe(false);
  });

  test("rejects an invalid hash format", () => {
    const buffer = Buffer.from("RecoverIQ");

    expect(() => {
      verifySHA256(buffer, "invalid-hash");
    }).toThrow("Invalid SHA-256 hash format");
  });

  test("rejects non-Buffer input", () => {
    expect(() => {
      calculateSHA256("RecoverIQ");
    }).toThrow("Input must be a Buffer");
  });
});