import React, { useRef, useState } from "react";
import {
  Upload,
  FileImage,
  CheckCircle2,
  Play,
  Trash2,
  Sparkles,
  SlidersHorizontal,
  Zap,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { scanImage } from "../services/api";

export default function FileUploader({
  onScanComplete,
  isScanning,
  setIsScanning,
}) {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [scanMode, setScanMode] = useState("smart");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileSelect = (file) => {
    if (!file) return;

    setError("");
    setSelectedFile(file);
    setProgress(0);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleChooseFile = () => {
    if (!isScanning) {
      fileInputRef.current?.click();
    }
  };

  const handleClearFile = () => {
    if (isScanning) return;

    setSelectedFile(null);
    setProgress(0);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";

    const units = ["B", "KB", "MB", "GB"];

    const index = Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
  };

  const handleStartScan = async () => {
    console.log("=== RecoverIQ Scan Started ===");

    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    if (!(selectedFile instanceof File)) {
      setError("Invalid file. Please select the file again.");
      return;
    }

    setError("");
    setIsScanning(true);
    setProgress(5);

    console.log("Selected file:", selectedFile.name);
    console.log("File size:", selectedFile.size);
    console.log("Scan mode:", scanMode);

    // Visual progress only.
    const progressTimer = setInterval(() => {
      setProgress((current) => {
        if (current >= 90) {
          clearInterval(progressTimer);
          return current;
        }

        return current + 10;
      });
    }, 150);

    try {
      console.log("Sending file to RecoverIQ backend...");

      const result = await scanImage(selectedFile);

      console.log("Backend response:", result);

      clearInterval(progressTimer);

      setProgress(100);

      if (!result) {
        throw new Error("Backend returned an empty response.");
      }

      // Give the UI a moment to show 100%.
      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log("Updating dashboard with scan results...");

      onScanComplete(result);

      console.log("=== RecoverIQ Scan Completed ===");
    } catch (err) {
      clearInterval(progressTimer);

      console.error("RecoverIQ scan error:", err);

      setError(
        err?.message ||
          "Unable to complete the forensic scan."
      );

      setProgress(0);
    } finally {
      setIsScanning(false);
    }
  };

  const createDemoFile = () => {
    const demoContent =
      "%PDF-1.4\n" +
      "RecoverIQ forensic recovery test file\n" +
      "This is a demo file used for API testing.\n" +
      "%%EOF";

    const demoFile = new File(
      [demoContent],
      "recoveriq_demo.pdf",
      {
        type: "application/pdf",
      }
    );

    handleFileSelect(demoFile);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">

      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Upload className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Source Image & Volume Ingestion
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Select or drop a disk image, raw file, or partition image
                to begin recovery analysis.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            RecoverIQ API
          </div>

        </div>
      </div>

      {/* Upload Area */}
      <div className="p-6">

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleInputChange}
          disabled={isScanning}
        />

        <div
          onClick={handleChooseFile}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            min-h-[210px]
            rounded-2xl
            border-2
            border-dashed
            flex
            items-center
            justify-center
            text-center
            transition-all
            ${
              selectedFile
                ? "border-emerald-500/60 bg-emerald-500/5"
                : "border-cyan-500/40 bg-slate-950/30 hover:border-cyan-400/70 hover:bg-cyan-500/5"
            }
            ${isScanning ? "cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          {selectedFile ? (
            <div className="flex flex-col items-center">

              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <h3 className="text-white font-semibold">
                {selectedFile.name}
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                {formatFileSize(selectedFile.size)} • Ready for API scan
              </p>

              {!isScanning && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleChooseFile();
                  }}
                  className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 underline"
                >
                  Click to replace file
                </button>
              )}

            </div>
          ) : (
            <div className="flex flex-col items-center">

              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <Upload className="w-7 h-7 text-cyan-400" />
              </div>

              <h3 className="text-white font-semibold">
                Drop your recovery image here
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                or click to browse files
              </p>

              <p className="text-xs text-slate-500 mt-3">
                PDF, PNG, JPEG, RAW and disk images
              </p>

            </div>
          )}
        </div>

        {/* Scan Modes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">

          <button
            type="button"
            disabled={isScanning}
            onClick={() => setScanMode("smart")}
            className={`
              text-left p-4 rounded-xl border transition-all
              ${
                scanMode === "smart"
                  ? "border-indigo-500 bg-indigo-500/20"
                  : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
              }
            `}
          >
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              Smart AI Carving
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Scan file signatures and identify recoverable files.
            </p>
          </button>

          <button
            type="button"
            disabled={isScanning}
            onClick={() => setScanMode("deep")}
            className={`
              text-left p-4 rounded-xl border transition-all
              ${
                scanMode === "deep"
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
              }
            `}
          >
            <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
              <SlidersHorizontal className="w-4 h-4" />
              Deep RAW Cluster Scan
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Inspect file data for recoverable content.
            </p>
          </button>

          <button
            type="button"
            disabled={isScanning}
            onClick={() => setScanMode("fast")}
            className={`
              text-left p-4 rounded-xl border transition-all
              ${
                scanMode === "fast"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
              }
            `}
          >
            <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
              <Zap className="w-4 h-4" />
              Fast Partition Scan
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Quickly inspect the uploaded file.
            </p>
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />

            <div>
              <p className="text-sm font-semibold text-red-300">
                Scan Error
              </p>

              <p className="text-xs text-red-200/80 mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Progress */}
        {isScanning && (
          <div className="mt-5">

            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400">
                Analyzing file with RecoverIQ backend...
              </span>

              <span className="text-cyan-400 font-mono">
                {progress}%
              </span>
            </div>

            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end items-center gap-3 mt-6">

          <button
            type="button"
            onClick={handleClearFile}
            disabled={!selectedFile || isScanning}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Clear File
          </button>

          <button
            type="button"
            onClick={handleStartScan}
            disabled={!selectedFile || isScanning}
            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-xl
              font-semibold
              text-sm
              text-white
              bg-gradient-to-r
              from-cyan-500
              to-indigo-600
              hover:from-cyan-400
              hover:to-indigo-500
              disabled:opacity-40
              disabled:cursor-not-allowed
              shadow-lg
              shadow-indigo-500/20
              transition-all
            "
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Submit to API & Start Scan
              </>
            )}
          </button>

        </div>

        {/* Demo button */}
        {!selectedFile && !isScanning && (
          <div className="mt-4 text-right">
            <button
              type="button"
              onClick={createDemoFile}
              className="text-xs text-slate-500 hover:text-cyan-400"
            >
              Load Sample Recovery File
            </button>
          </div>
        )}

      </div>
    </div>
  );
}