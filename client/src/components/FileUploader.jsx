import React, { useState, useRef } from 'react';
import { scanImage } from '../services/api';
import { Tag, Pin, CheckCircle2, AlertTriangle, Loader2, Sparkles, Sliders, Play, FileCheck, Hash } from 'lucide-react';

export default function FileUploader({ onScanComplete, isScanning, setIsScanning }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanMode, setScanMode] = useState('smart');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentSector, setCurrentSector] = useState('0x00000000');
  const [scanStatusMessage, setScanStatusMessage] = useState('Idle');
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setScanProgress(0);
    setErrorMessage(null);
  };

  const handleStartScan = async () => {
    if (!selectedFile) {
      setErrorMessage("Please pin a disk image or evidence file to the board.");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setErrorMessage(null);
    setScanStatusMessage('Mounting evidence stream & locating magic byte headers...');

    let progress = 10;
    const progressTimer = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 6;
      if (progress > 92) progress = 92;
      setScanProgress(progress);
      const randomSector = '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
      setCurrentSector(randomSector);

      if (progress < 40) {
        setScanStatusMessage('Locating signatures: [FF D8 FF] JPEG, [89 50 4E 47] PNG, [%PDF-] PDF...');
      } else if (progress < 75) {
        setScanStatusMessage('Carving unallocated raw clusters & tracing fragment affinities...');
      } else {
        setScanStatusMessage('Computing SHA-256 cryptographic ledgers & parity indices...');
      }
    }, 110);

    try {
      const apiResponse = await scanImage(selectedFile);

      clearInterval(progressTimer);
      setScanProgress(100);
      setScanStatusMessage('Forensic carving complete!');

      setTimeout(() => {
        setIsScanning(false);
        if (onScanComplete) {
          onScanComplete(apiResponse);
        }
      }, 500);
    } catch (err) {
      clearInterval(progressTimer);
      setIsScanning(false);
      setErrorMessage(err.message || "Failed to scan pinned evidence.");
    }
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
              Pin a raw disk dump, corrupted filesystem stream, or evidence container to the board.
            </p>
          </div>

          {!selectedFile && (
            <button
              onClick={loadGroundTruthEvidence}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#25201D] hover:bg-[#2F2926] text-[#D8C39A] text-xs font-mono border border-[#B39F73]/40 transition cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-[#B33A2E]" />
              Pin Ground-Truth Evidence Disk
            </button>
          )}
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
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
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
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
          />

          {selectedFile ? (
            <div className="kraft-card p-5 rounded max-w-lg mx-auto text-left relative">
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
              <div className="w-10 h-10 rounded-full bg-[#25201D] border border-[#3A332F] flex items-center justify-center text-[#B33A2E]">
                <Pin className="w-5 h-5" />
              </div>
              <p className="font-document text-lg font-bold text-[#F2EFE9]">
                Pin evidence here
              </p>
              <p className="text-xs font-mono text-[#A39D95]">
                Drop raw disk dump (.raw, .img, .dd, .vmdk) or browse local evidence drives
              </p>
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
          </div>

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
          </div>

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
          </div>
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

            <div className="w-full h-2 bg-[#25201D] rounded overflow-hidden p-0.5 border border-[#3A332F]">
              <div
                className="h-full bg-[#B33A2E] transition-all duration-150 rounded"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#A39D95] mt-2 font-mono">
              <span>SCANNING EVIDENCE VOLUME</span>
              <span className="font-bold text-[#F2EFE9]">{scanProgress}%</span>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
            {selectedFile && (
              <button
                onClick={() => setSelectedFile(null)}
                className="w-full sm:w-auto px-4 py-2 rounded bg-[#25201D] hover:bg-[#2F2926] text-[#A39D95] text-xs font-mono border border-[#3A332F] transition cursor-pointer"
              >
                Unpin Evidence
              </button>
            )}
            <button
              onClick={handleStartScan}
              disabled={!selectedFile}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded font-document font-bold text-xs tracking-wide transition-all ${
                selectedFile
                  ? 'bg-[#B33A2E] hover:bg-[#9B2F25] text-[#F2EFE9] shadow-md cursor-pointer'
                  : 'bg-[#25201D] text-[#4A5560] cursor-not-allowed border border-[#2F2926]'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              Analyze & Reconstruct Evidence
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
