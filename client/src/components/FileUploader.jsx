import React, { useState, useRef } from 'react';
import { scanImage } from '../services/api';
import { UploadCloud, CheckCircle2, AlertTriangle, Loader2, Sparkles, Sliders, Play, Database } from 'lucide-react';

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
      setErrorMessage("Please drop or select a disk image / dump file first.");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setErrorMessage(null);
    setScanStatusMessage('Mounting virtual stream & invoking API scan engine...');

    // Progress simulation while API call executes
    let progress = 10;
    const progressTimer = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 90) progress = 90;
      setScanProgress(progress);
      const randomSector = '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
      setCurrentSector(randomSector);

      if (progress < 40) {
        setScanStatusMessage('Parsing filesystem metadata (MFT / Inode Table)...');
      } else if (progress < 75) {
        setScanStatusMessage('Carving unallocated raw clusters with neural heuristics...');
      } else {
        setScanStatusMessage('Synthesizing recovery ledger & calculating checksums...');
      }
    }, 120);

    try {
      // Call mock API service
      const apiResponse = await scanImage(selectedFile);

      clearInterval(progressTimer);
      setScanProgress(100);
      setScanStatusMessage('Scan analysis complete!');

      setTimeout(() => {
        setIsScanning(false);
        if (onScanComplete) {
          onScanComplete(apiResponse);
        }
      }, 500);
    } catch (err) {
      clearInterval(progressTimer);
      setIsScanning(false);
      setErrorMessage(err.message || "Failed to scan disk image.");
    }
  };

  const loadDemoDiskImage = () => {
    const demo = {
      name: "corrupted_workstation_nvme_backup.img",
      size: 4825000000,
      type: "disk/raw-image"
    };
    setSelectedFile(demo);
    setErrorMessage(null);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-sky-400" />
              Source Image & Volume Ingestion
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select or drop a raw disk dump, virtual disk image, or partition image to begin investigation.
            </p>
          </div>

          {!selectedFile && (
            <button
              onClick={loadDemoDiskImage}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sky-300 text-xs font-medium border border-sky-500/20 transition-all cursor-pointer"
            >
              <Database className="w-4 h-4 text-sky-400" />
              Load Sample Disk Dump
            </button>
          )}
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            dragActive
              ? "border-sky-400 bg-sky-500/10 scale-[1.01]"
              : selectedFile
              ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60"
              : "border-slate-700/80 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
          />

          {selectedFile ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white mt-1">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for API scan engine
              </p>
              <span className="text-[11px] text-sky-400 underline mt-1">Click to replace file</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Drop your raw disk image (.img, .dd, .raw, .vmdk, .bin) here
              </p>
              <p className="text-xs text-slate-400">
                Or click to browse from local workstation storage
              </p>
            </div>
          )}
        </div>

        {/* Scan Mode Options */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            onClick={() => setScanMode('smart')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              scanMode === 'smart'
                ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-xs mb-1 text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Smart AI Carving
            </div>
            <p className="text-[11px] text-slate-400">
              Deep signature and fragmented header matching.
            </p>
          </div>

          <div
            onClick={() => setScanMode('deep')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              scanMode === 'deep'
                ? 'bg-sky-600/20 border-sky-500/50 text-white shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-xs mb-1 text-sky-300">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              Deep RAW Cluster Scan
            </div>
            <p className="text-[11px] text-slate-400">
              Direct low-level bitstream inspection across all sectors.
            </p>
          </div>

          <div
            onClick={() => setScanMode('quick')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              scanMode === 'quick'
                ? 'bg-emerald-600/20 border-emerald-500/50 text-white shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-xs mb-1 text-emerald-300">
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              Fast Partition Scan
            </div>
            <p className="text-[11px] text-slate-400">
              Quick filesystem table & MFT index recovery.
            </p>
          </div>
        </div>

        {/* Progress Display or Submit Button */}
        {isScanning ? (
          <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
              <span className="flex items-center gap-2 text-sky-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                {scanStatusMessage}
              </span>
              <span className="text-slate-400">Sector: {currentSector}</span>
            </div>

            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 transition-all duration-150"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
              <span>SCANNING VIA API SERVICE</span>
              <span className="font-bold text-white">{scanProgress}%</span>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
            {selectedFile && (
              <button
                onClick={() => setSelectedFile(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
              >
                Clear File
              </button>
            )}
            <button
              onClick={handleStartScan}
              disabled={!selectedFile}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs shadow-lg transition-all ${
                selectedFile
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-400 hover:to-indigo-500 shadow-indigo-600/30 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              Submit to API & Start Scan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
