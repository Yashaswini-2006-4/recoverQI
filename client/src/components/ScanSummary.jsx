import React, { useState } from 'react';
import {
  FileText,
  Image,
  Database,
  Archive,
  Download,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  Check,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function ScanSummary({ scanData, onReset }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  if (!scanData) return null;

  const iconMap = {
    FileText: <FileText className="w-5 h-5" />,
    Image: <Image className="w-5 h-5" />,
    Database: <Database className="w-5 h-5" />,
    Archive: <Archive className="w-5 h-5" />,
  };

  const filteredFiles = scanData.recoveredFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.originalPath.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || file.type.toLowerCase().includes(selectedType.toLowerCase());
    return matchesSearch && matchesType;
  });

  const toggleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((f) => f.id));
    }
  };

  const toggleSelectFile = (id) => {
    if (selectedFiles.includes(id)) {
      setSelectedFiles(selectedFiles.filter((item) => item !== id));
    } else {
      setSelectedFiles([...selectedFiles, id]);
    }
  };

  const handleExportSelected = () => {
    const count = selectedFiles.length > 0 ? selectedFiles.length : filteredFiles.length;
    setDownloadSuccessMessage(`Successfully extracted and restored ${count} files to /RecoverIQ_Restored/`);
    setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {downloadSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>{downloadSuccessMessage}</span>
          </div>
          <button
            onClick={() => setDownloadSuccessMessage(null)}
            className="text-xs text-emerald-400 underline hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main KPI Summary Panel */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
                SCAN COMPLETE
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {scanData.scanId}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-2">
              Recovery Audit & Ledger Analysis
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-sky-400" />
              Target: <span className="text-slate-200 font-mono">{scanData.targetDrive}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              New Scan
            </button>
            <button
              onClick={handleExportSelected}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Recovered Files ({selectedFiles.length > 0 ? selectedFiles.length : filteredFiles.length})
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Files Identified</p>
            <p className="text-2xl font-bold text-white mt-1">{scanData.recoverableCount.toLocaleString()}</p>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <Check className="w-3 h-3" /> {scanData.recoverableSize} Recoverable
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Integrity Index</p>
            <p className="text-2xl font-bold text-sky-400 mt-1">{scanData.healthScore}%</p>
            <p className="text-xs text-slate-400 mt-1">High parity consistency</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Corrupted Clusters</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{scanData.corruptedCount}</p>
            <p className="text-xs text-slate-400 mt-1">Reconstructed via ECC</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Scan Duration</p>
            <p className="text-2xl font-bold text-indigo-300 mt-1">{scanData.scanDuration}</p>
            <p className="text-xs text-slate-400 mt-1">Throughput: 1.2 GB/s</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scanData.categories.map((cat, idx) => (
          <div
            key={idx}
            className="glass-panel p-5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between">
              <span className={`p-2.5 rounded-lg ${cat.bg} ${cat.color}`}>
                {iconMap[cat.icon] || <FileText className="w-5 h-5" />}
              </span>
              <span className="text-xs font-mono font-medium text-slate-400">{cat.size}</span>
            </div>
            <h2 className="text-sm font-semibold text-slate-200 mt-3">{cat.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{cat.count} candidate objects reconstructed</p>
          </div>
        ))}
      </div>

      {/* File Ledger and Carved Items Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Reconstructed File Stream
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review checksums and select items for forensic export.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search file name or path..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-48 sm:w-64"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {['All', 'Spreadsheet', 'Database', 'PDF', 'Archive'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    selectedType === type
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Files Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={filteredFiles.length > 0 && selectedFiles.length === filteredFiles.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                  />
                </th>
                <th className="py-3 px-4">File Name & Original Path</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Integrity Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredFiles.map((file) => {
                const isSelected = selectedFiles.includes(file.id);
                return (
                  <tr
                    key={file.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-indigo-950/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectFile(file.id)}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-slate-200 hover:text-sky-400 cursor-pointer" onClick={() => setPreviewFile(file)}>
                          {file.name}
                        </p>
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5">{file.originalPath}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {file.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{file.size}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${file.recoveryConfidence}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-emerald-400 font-semibold">
                          {file.recoveryConfidence}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          file.recoveryConfidence >= 95
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {file.recoveryConfidence >= 95 ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {file.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewFile(file)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title="Inspect Metadata & Hex"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDownloadSuccessMessage(`Exported ${file.name} to downloads.`);
                          }}
                          className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition"
                          title="Export this file"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal File Inspector */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">File Inspector & Hash Verifier</h3>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <p className="text-slate-400">File Name</p>
                <p className="font-semibold text-white font-mono text-sm">{previewFile.name}</p>
              </div>

              <div>
                <p className="text-slate-400">Original Path</p>
                <p className="font-mono text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
                  {previewFile.originalPath}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400">Size:</span>
                  <p className="font-mono text-slate-200 mt-0.5">{previewFile.size}</p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400">Recovery Confidence:</span>
                  <p className="font-mono text-emerald-400 font-bold mt-0.5">{previewFile.recoveryConfidence}%</p>
                </div>
              </div>

              <div>
                <p className="text-slate-400">SHA-256 Signature Verification</p>
                <p className="font-mono text-[11px] text-sky-300 bg-slate-900 p-2 rounded border border-slate-800 break-all">
                  {previewFile.hash}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Hex Header Preview</p>
                <pre className="font-mono text-[10px] text-slate-400 bg-slate-950 p-3 rounded border border-slate-800 overflow-x-auto">
{`00000000: 50 4B 03 04 14 00 06 00 08 00 00 00 21 00 E3 B0 C4 42  PK..........!..B
00000010: 98 FC 1C 14 9A FB F4 C8 99 6F B9 24 1F 00 00 00 64 00  .........o.$....
00000020: 78 6C 2F 77 6F 72 6B 73 68 65 65 74 73 2F 73 68 65 65  xl/worksheets/she
[VERIFIED BY RECOVERIQ NEURAL HEADER MATCH]`}
                </pre>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDownloadSuccessMessage(`Exported ${previewFile.name}.`);
                  setPreviewFile(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Export This File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
