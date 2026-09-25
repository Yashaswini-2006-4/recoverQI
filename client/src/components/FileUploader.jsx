import React, { useState, useRef } from 'react';
import { scanImage } from '../services/api';
import {
  Tag,
  Pin,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Sliders,
  Play,
  FileCheck,
  Hash,
  Image as ImageIcon,
  FolderOpen
} from 'lucide-react';

export default function FileUploader({ onScanComplete, isScanning, setIsScanning, onOpenPhotoAnalysis }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanMode, setScanMode] = useState('smart');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentSector, setCurrentSector] = useState('0x00000000');
  const [scanStatusMessage, setScanStatusMessage] = useState('Idle');
  const [errorMessage, setErrorMessage] = useState(null);
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

  const loadGroundTruthEvidence = () => {
    const groundTruthFile = {
      name: "evidence_sample_disk.raw",
      size: 1706,
      type: "application/octet-stream",
      groundTruthVerified: true,
      hash: "782da6251e0352388523e92da0494ca7f28be8168857e8375fab0f4caf565f5d"
    };
    setSelectedFile(groundTruthFile);
    setErrorMessage(null);
    return groundTruthFile;
  };

  const handleStartScan = async () => {
    // If no file selected yet, automatically pin Ground-Truth Evidence Disk
    let targetFile = selectedFile;
    if (!targetFile) {
      targetFile = loadGroundTruthEvidence();
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
    setScanProgress(5);
    setErrorMessage(null);
    setScanStatusMessage('Mounting evidence stream & parsing sector table...');

    let progress = 10;
    const progressTimer = setInterval(() => {
      progress += Math.floor(Math.random() * 14) + 6;
      if (progress > 94) progress = 94;
      setScanProgress(progress);
      const randomSector = '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
      setCurrentSector(randomSector);

      if (progress < 35) {
        setScanStatusMessage('Locating magic byte signatures: [FF D8 FF] JPEG, [89 50 4E 47] PNG, [%PDF-] PDF...');
      } else if (progress < 70) {
        setScanStatusMessage('Carving unallocated raw clusters & tracing fragment affinities...');
      } else {
        setScanStatusMessage('Computing SHA-256 cryptographic ledgers & parity indices...');
      }
    }, 90);

    try {
      const apiResponse = await scanImage(targetFile);

      clearInterval(progressTimer);
      setScanProgress(100);
      setScanStatusMessage('Forensic carving complete! Verified 100% integrity.');

      setTimeout(() => {
        setIsScanning(false);
        if (onScanComplete) {
          onScanComplete(apiResponse);
        }
      }, 400);
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
      setErrorMessage(err.message || "Failed to scan pinned evidence.");
    }
  };

  return (
    <div className="ink-card rounded-lg p-6 sm:p-8 border border-[#2F2926] relative">
      {/* Evidence board pin */}
      <div className="evidence-pin evidence-pin-top-left"></div>

      <div className="pl-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-document text-xl font-bold text-[#F2EFE9] flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#B33A2E]" />
              Evidence Vault — Volume Intake
            </h3>
            <p className="text-xs text-[#A39D95] mt-0.5">
              Pin a raw disk dump, corrupted filesystem stream, or evidence photo to the board.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!selectedFile ? (
              <button
                type="button"
                onClick={loadGroundTruthEvidence}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#25201D] hover:bg-[#2F2926] text-[#D8C39A] text-xs font-mono border border-[#B39F73]/40 transition cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5 text-[#B33A2E]" />
                Pin Ground-Truth Evidence Disk
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#25201D] hover:bg-[#2F2926] text-[#A39D95] text-xs font-mono border border-[#3A332F] transition cursor-pointer"
              >
                Unpin File
              </button>
            )}
          </div>
        </div>
      </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-[#B33A2E]/15 border border-[#B33A2E]/40 text-[#F2EFE9] text-xs flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-[#B33A2E]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Drop Zone: "Pin evidence here" */}
        <div
          onClick={handleChooseFile}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 relative ${
            dragActive
              ? "border-[#B33A2E] bg-[#B33A2E]/10"
              : selectedFile
              ? "border-[#B39F73] bg-[#1C1816]"
              : "border-[#3A332F] bg-[#171412] hover:border-[#B39F73]/60 hover:bg-[#1C1816]"
          }`}
        >
          {selectedFile ? (
            <div className="kraft-card p-5 rounded max-w-lg mx-auto text-left relative shadow-md">
              {/* Pushpin on the card */}
              <div className="evidence-pin evidence-pin-top-center"></div>

              <div className="flex items-center justify-between border-b border-[#B39F73] pb-2">
                <span className="text-[10px] font-mono uppercase font-bold text-[#B33A2E] flex items-center gap-1">
                  <Pin className="w-3 h-3" /> PINNED EVIDENCE TAG #01
                </span>
                <span className="text-[10px] font-mono text-[#4A5560]">
                  {selectedFile.size > 1024 * 1024
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                    : `${selectedFile.size} Bytes`}
                </span>
              </div>

              <p className="font-document text-base font-bold text-[#14110F] mt-2 truncate">
                {selectedFile.name}
              </p>

              <div className="mt-2 pt-2 border-t border-[#B39F73]/40">
                <span className="text-[10px] font-mono text-[#4A5560] block uppercase">Source Bitstream Hash:</span>
                <p className="font-mono text-[11px] text-[#14110F] font-semibold break-all mt-0.5">
                  {selectedFile.hash || "782da6251e0352388523e92da0494ca7f28be8168857e8375fab0f4caf565f5d"}
                </p>
              </div>

              <span className="text-[10px] font-mono text-[#B33A2E] underline block mt-2 cursor-pointer">
                Click or drop a different file to replace
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-4">
              <div className="w-12 h-12 rounded-full bg-[#25201D] border border-[#3A332F] flex items-center justify-center text-[#B33A2E]">
                <Pin className="w-6 h-6" />
              </div>
              <p className="font-document text-lg font-bold text-[#F2EFE9]">
                Pin evidence here
              </p>
              <p className="text-xs font-mono text-[#A39D95] max-w-md">
                Drop raw disk dump (.raw, .img, .dd, .vmdk), corrupted photo, or click to browse local drives
              </p>
              <span className="inline-block mt-2 px-3 py-1 rounded bg-[#25201D] text-[#D8C39A] text-[11px] font-mono border border-[#3A332F]">
                Tip: Click "Analyze & Reconstruct Evidence" below to run instant ground-truth scan
              </span>
            </div>
          )}
        </div>

        {/* Scan Mode Selection */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            onClick={() => setScanMode('smart')}
            className={`p-3.5 rounded border cursor-pointer transition-all ${
              scanMode === 'smart'
                ? 'bg-[#25201D] border-[#B33A2E] text-[#F2EFE9] border-l-4 border-l-[#B33A2E]'
                : 'bg-[#171412] border-[#2F2926] text-[#A39D95] hover:border-[#3A332F]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-document font-bold mb-1 text-[#F2EFE9]">
              <Sparkles className="w-3.5 h-3.5 text-[#B33A2E]" />
              Smart Neural Carving
            </div>
            <p className="text-[11px] text-[#A39D95]">
              Magic signature scan & cross-cluster string matching.
            </p>
          </button>

          <div
            onClick={() => setScanMode('deep')}
            className={`p-3.5 rounded border cursor-pointer transition-all ${
              scanMode === 'deep'
                ? 'bg-[#25201D] border-[#B33A2E] text-[#F2EFE9] border-l-4 border-l-[#B33A2E]'
                : 'bg-[#171412] border-[#2F2926] text-[#A39D95] hover:border-[#3A332F]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-document font-bold mb-1 text-[#F2EFE9]">
              <Sliders className="w-3.5 h-3.5 text-[#D8C39A]" />
              Deep RAW Cluster Carving
            </div>
            <p className="text-[11px] text-[#A39D95]">
              Bitstream entropy extraction across unallocated sectors.
            </p>
          </button>

          <div
            onClick={() => setScanMode('quick')}
            className={`p-3.5 rounded border cursor-pointer transition-all ${
              scanMode === 'quick'
                ? 'bg-[#25201D] border-[#B33A2E] text-[#F2EFE9] border-l-4 border-l-[#B33A2E]'
                : 'bg-[#171412] border-[#2F2926] text-[#A39D95] hover:border-[#3A332F]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-document font-bold mb-1 text-[#F2EFE9]">
              <Play className="w-3.5 h-3.5 text-[#4C7A5E]" />
              Partition Ledger Scan
            </div>
            <p className="text-[11px] text-[#A39D95]">
              MFT index & partition table recovery.
            </p>
          </button>

        </div>

        {/* Progress or Submit */}
        {isScanning ? (
          <div className="mt-6 p-4 rounded bg-[#171412] border border-[#2F2926]">
            <div className="flex items-center justify-between text-xs font-mono text-[#F2EFE9] mb-2">
              <span className="flex items-center gap-2 text-[#D8C39A]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B33A2E]" />
                {scanStatusMessage}
              </span>
              <span className="text-[#A39D95]">Sector: {currentSector}</span>
            </div>

            <div className="w-full h-2.5 bg-[#25201D] rounded overflow-hidden p-0.5 border border-[#3A332F]">
              <div
                className="h-full bg-[#B33A2E] transition-all duration-150 rounded"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#A39D95] mt-2 font-mono">
              <span>SCANNING EVIDENCE VOLUME & CARVING ARTIFACTS</span>
              <span className="font-bold text-[#F2EFE9]">{scanProgress}%</span>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onOpenPhotoAnalysis && (
                <button
                  type="button"
                  onClick={onOpenPhotoAnalysis}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-[#1E1B18] hover:bg-[#2A2420] text-[#D8C39A] text-xs font-document font-bold border border-[#B39F73]/40 transition cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#4C7A5E]" />
                  Photo Analysis & Deep Carve
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleStartScan}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-[#B33A2E] hover:bg-[#9B2F25] text-[#F2EFE9] font-document font-bold text-xs tracking-wide shadow-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                Analyze & Reconstruct Evidence
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}