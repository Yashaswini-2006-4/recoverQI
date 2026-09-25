import React, { useState, useRef } from 'react';
import { UploadCloud, File, CheckCircle2, AlertTriangle, Loader2, Sparkles, Sliders, Play, RotateCcw, Database } from 'lucide-react';

export default function FileUploader({ onScanComplete, isScanning, setIsScanning }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanMode, setScanMode] = useState('smart');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentSector, setCurrentSector] = useState('0x00000000');
  const [scanStatusMessage, setScanStatusMessage] = useState('Idle');
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
  };

  const startScan = () => {
    if (!selectedFile && !scanMode) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanStatusMessage('Mounting virtual stream and analyzing sector blocks...');

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress > 100) progress = 100;

      const randomSector = '0x' + Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
      setCurrentSector(randomSector);
      setScanProgress(progress);

      if (progress < 30) {
        setScanStatusMessage('Parsing filesystem metadata (MFT / Inode Table)...');
      } else if (progress < 70) {
        setScanStatusMessage('Carving unallocated raw clusters & neural pattern matching...');
      } else if (progress < 95) {
        setScanStatusMessage('Reconstructing fragmented headers & verifying SHA-256 signatures...');
      } else {
        setScanStatusMessage('Compiling recovery ledger and building health index...');
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          if (onScanComplete) {
            onScanComplete({
              fileName: selectedFile?.name || "corrupted_disk_image_vol1.img",
              fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "4.8 GB",
              scanMode: scanMode
            });
          }
        }, 600);
      }
    }, 150);
  };

  const loadDemoDiskImage = () => {
    setSelectedFile({
      name: "corrupted_workstation_nvme_backup.img",
      size: 4825000000,
      type: "disk/raw-image"
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
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
            <p className="text-sm text-slate-400 mt-1">
              Upload a raw disk dump, disk image (.img, .dd, .vmdk, .raw), or inspect virtual partitions.
            </p>
          </div>

          {!selectedFile && (
            <button
              onClick={loadDemoDiskImage}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sky-300 text-xs font-medium border border-sky-500/20 transition-all cursor-pointer"
            >
              <Database className="w-4 h-4 text-sky-400" />
              Load Demo Corrupted Image
            </button>
          )}
        </div>

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
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-semibold text-white">{selectedFile.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for deep sector analysis
                </p>
              </div>
              <span className="text-xs text-sky-400 underline mt-1">Click or drag a different file to replace</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Drop your disk image, archive, or database dump here
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports .img, .dd, .raw, .vmdk, .bin, .tar, .zip and unallocated volumes
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Scan Parameters & Mode Selector */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setScanMode('smart')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              scanMode === 'smart'
                ? 'bg-indigo-600/20 border-indigo-500/50 text-white glow-indigo'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Smart Neural Heuristic
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-assisted header carving & partial signature reconstruction.
            </p>
          </div>

          <div
            onClick={() => setScanMode('deep')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              scanMode === 'deep'
                ? 'bg-sky-600/20 border-sky-500/50 text-white glow-blue'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-sky-300">
              <Sliders className="w-4 h-4 text-sky-400" />
              Deep RAW Sector Carving
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full cluster-by-cluster bitstream extraction regardless of MFT state.
            </p>
          </div>

          <div
            onClick={() => setScanMode('quick')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              scanMode === 'quick'
                ? 'bg-emerald-600/20 border-emerald-500/50 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-emerald-300">
              <Play className="w-4 h-4 text-emerald-400" />
              Fast Partition Scan
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recovers deleted files with intact partition tables & directory nodes.
            </p>
          </div>
        </div>

        {/* Progress & Actions */}
        {isScanning ? (
          <div className="mt-6 p-5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
              <span className="flex items-center gap-2 text-sky-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                {scanStatusMessage}
              </span>
              <span className="text-slate-400">Sector: {currentSector}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 transition-all duration-150"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 mt-2 font-mono">
              <span>SCANNING BITSTREAM</span>
              <span className="font-bold text-white">{scanProgress}%</span>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
            {selectedFile && (
              <button
                onClick={() => setSelectedFile(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              onClick={startScan}
              disabled={!selectedFile}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all ${
                selectedFile
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-400 hover:to-indigo-500 shadow-indigo-600/30 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Play className="w-4 h-4" />
              Initialize Scan Engine
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
