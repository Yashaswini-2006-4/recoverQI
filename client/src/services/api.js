// client/src/services/api.js
// Mock API service layer for RecoverIQ
// This layer abstracts all network requests. Later, simply replace the internal Promise implementations with real fetch() calls.

import { mockScanData, sampleRecentScans } from '../data/mockData';

/**
 * Simulates uploading and analyzing a disk image / raw file.
 * @param {File|Object} file - The file object to scan.
 * @returns {Promise<Object>} Scan results shaped as { scanId, summary, artifacts, ... }
 */
export async function scanImage(file) {
  // Simulate network latency & backend analysis
  return new Promise((resolve) => {
    setTimeout(() => {
      const generatedId = `SCN-${Date.now().toString().slice(-6)}`;
      const fileName = file?.name || "corrupted_source_image.raw";
      const fileSize = file?.size ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "482.5 GB";

      const response = {
        ...mockScanData,
        scanId: generatedId,
        targetDrive: `${fileName} (${fileSize})`,
        timestamp: new Date().toISOString(),
        summary: {
          ...mockScanData.summary,
          filesDetected: Math.floor(Math.random() * 5000) + 12000,
          filesRecovered: Math.floor(Math.random() * 4000) + 10000,
          partialFiles: Math.floor(Math.random() * 800) + 1500,
          failedFiles: Math.floor(Math.random() * 200) + 100,
          scanDuration: "2m 14s",
        }
      };

      resolve(response);
    }, 1200);
  });
}

/**
 * Retrieves the full scan result and artifacts for a specific scanId.
 * @param {string} scanId - The unique scan identifier.
 * @returns {Promise<Object>} The matching scan result or fallback mock data.
 */
export async function getScanResults(scanId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!scanId) {
        reject(new Error("scanId is required"));
        return;
      }

      // Check if it matches existing mock or generate deterministic result
      const result = {
        ...mockScanData,
        scanId: scanId,
        timestamp: new Date().toISOString(),
      };
      resolve(result);
    }, 400);
  });
}

/**
 * Retrieves past scan sessions for dashboard history.
 * @returns {Promise<Array>} List of recent scans.
 */
export async function getRecentScans() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleRecentScans);
    }, 300);
  });
}

export default {
  scanImage,
  getScanResults,
  getRecentScans,
};
