// client/src/services/api.js

const API_BASE_URL = "http://127.0.0.1:8000";

export async function scanImage(file) {
  if (!file || !(file instanceof File)) {
    throw new Error("Please select a valid file to scan.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/recovery/scan`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "File scanning failed."
    );
  }

  return result;
}

// Keep these functions available for existing dashboard components.
export async function getScanResults(scanId) {
  return {
    scanId,
    artifacts: [],
    summary: {
      filesDetected: 0,
      filesRecovered: 0,
      partialFiles: 0,
      failedFiles: 0,
    },
  };
}

export async function getRecentScans() {
  return [];
}

export default {
  scanImage,
  getScanResults,
  getRecentScans,
};