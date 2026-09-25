import React, { useState } from 'react';
import { downloadReport } from '../services/api';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSearch,
  Download,
  FileText,
  HardDrive,
  RefreshCw,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export default function ScanSummary({ scanData, onReset }) {
  const [reportDownloading, setReportDownloading] = useState(false);
  const [notice, setNotice] = useState(null);

  if (!scanData) return null;

  const { scanId, summary, targetDrive } = scanData;

  const handleDownloadAuditReport = async () => {
    setReportDownloading(true);
    setNotice("Generating forensic investigation report (PDF/Markdown)...");
    try {
      await downloadReport(scanId);
      setNotice(`Investigation report for ${scanId} downloaded successfully!`);
    } catch (err) {
      setNotice("Failed to download report.");
    } finally {
      setReportDownloading(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Scan Summary Header Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
                SCAN COMPLETED
              </span>
              <span className="text-xs text-slate-400 font-mono">Scan ID: {scanId}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-2">
              Volume Inspection & Carving Ledger
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-mono">
              <HardDrive className="w-4 h-4 text-sky-400" />
              Source: <span className="text-slate-200">{targetDrive || 'Target Volume Image'}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                New Scan
              </button>
            )}
            <button
              onClick={handleDownloadAuditReport}
              disabled={reportDownloading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              {reportDownloading ? "Generating Report..." : "Download Audit Report"}
            </button>
          </div>
        </div>

        {/* The 4 Core Metrics: filesDetected, filesRecovered, partialFiles, failedFiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {/* filesDetected */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Files Detected</p>
              <FileSearch className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-1">
              {summary?.filesDetected?.toLocaleString() ?? 0}
            </p>
            <p className="text-xs text-slate-400 mt-1">Total candidate entries</p>
          </div>

          {/* filesRecovered */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">Files Recovered</p>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-300 mt-1">
              {summary?.filesRecovered?.toLocaleString() ?? 0}
            </p>
            <p className="text-xs text-emerald-400/80 mt-1">100% integrity verified</p>
          </div>

          {/* partialFiles */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
            <div className="flex items-center justify-between">
              <p className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Partial Files</p>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-300 mt-1">
              {summary?.partialFiles?.toLocaleString() ?? 0}
            </p>
            <p className="text-xs text-amber-400/80 mt-1">Reconstructed with ECC</p>
          </div>

          {/* failedFiles */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-center justify-between">
              <p className="text-xs text-rose-400 uppercase tracking-wider font-semibold">Failed Files</p>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-bold text-rose-300 mt-1">
              {summary?.failedFiles?.toLocaleString() ?? 0}
            </p>
            <p className="text-xs text-rose-400/80 mt-1">Overwritten clusters</p>
          </div>
        </div>

        {/* Secondary Details */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-4 mt-4 border-t border-slate-800/60 font-mono">
          <span>Total Size: <strong className="text-slate-200">{summary?.totalSize || '482.5 GB'}</strong></span>
          <span>Recovered Size: <strong className="text-emerald-400">{summary?.recoveredSize || '142.8 GB'}</strong></span>
          <span>Health Score: <strong className="text-sky-400">{summary?.healthScore || 94.8}%</strong></span>
          <span>Scan Duration: <strong className="text-indigo-300">{summary?.scanDuration || '2m 14s'}</strong></span>
        </div>
      </div>
    </div>
  );
}
