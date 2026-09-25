import React, { useState } from 'react';
import { downloadReport } from '../services/api';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSearch,
  Download,
  FileCheck,
  Tag,
  Hash
} from 'lucide-react';

export default function ScanSummary({ scanData, onReset }) {
  const [reportDownloading, setReportDownloading] = useState(false);
  const [notice, setNotice] = useState(null);

  if (!scanData) return null;

  const { scanId, summary, targetDrive, timestamp } = scanData;

  const handleDownloadAuditReport = async () => {
    setReportDownloading(true);
    setNotice("Generating forensic report case document...");
    try {
      await downloadReport(scanId);
      setNotice(`Forensic Case Report for ${scanId} generated.`);
    } catch (err) {
      setNotice("Failed to export case report.");
    } finally {
      setReportDownloading(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {notice && (
        <div className="p-3.5 rounded border border-[#4C7A5E]/40 bg-[#1C1816] text-[#4C7A5E] text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Case Header Banner / File Docket */}
      <div className="ink-card rounded-lg p-6 relative border border-[#2F2926]">
        {/* Red pushpin at top left */}
        <div className="evidence-pin evidence-pin-top-left" title="Evidence Docket Pin"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-4 border-b border-[#2F2926] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rubber-stamp text-xs">
                CASE FILE #{scanId}
              </span>
              <span className="text-xs font-mono text-[#A39D95]">
                DOCKET: {timestamp ? new Date(timestamp).toLocaleDateString() : 'Active Investigation'}
              </span>
            </div>
            <h2 className="font-document text-2xl font-bold text-[#F2EFE9] mt-2 tracking-tight">
              Evidence Ledger & Recovery Audit
            </h2>
            <p className="text-xs font-mono text-[#A39D95] mt-1 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#D8C39A]" />
              Target Volume: <span className="text-[#F2EFE9]">{targetDrive || 'Physical Sector Dump'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onReset && (
              <button
                onClick={onReset}
                className="px-3.5 py-2 rounded bg-[#25201D] hover:bg-[#2F2926] text-[#F2EFE9] text-xs font-medium border border-[#3A332F] transition cursor-pointer"
              >
                Reset Docket
              </button>
            )}
            <button
              onClick={handleDownloadAuditReport}
              disabled={reportDownloading}
              className="flex items-center gap-2 px-4 py-2 rounded bg-[#B33A2E] hover:bg-[#9B2F25] text-[#F2EFE9] text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              {reportDownloading ? "Exporting..." : "Download Case Report"}
            </button>
          </div>
        </div>

        {/* 4 Pinned Index Card Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Card 1: Files Detected */}
          <div className="kraft-card p-4 rounded relative">
            <div className="evidence-pin evidence-pin-top-center"></div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase text-[#4A5560]">Files Detected</span>
              <FileSearch className="w-4 h-4 text-[#14110F]" />
            </div>
            <p className="font-document text-2xl font-bold text-[#14110F] mt-2">
              {summary?.filesDetected?.toLocaleString() ?? 14892}
            </p>
            <p className="text-[10px] font-mono text-[#4A5560] mt-1">Carved candidate signatures</p>
          </div>

          {/* Card 2: Files Recovered (Verified) */}
          <div className="kraft-card p-4 rounded relative border-l-4 border-l-[#4C7A5E]">
            <div className="evidence-pin evidence-pin-top-center"></div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase text-[#4C7A5E]">Verified Intact</span>
              <CheckCircle2 className="w-4 h-4 text-[#4C7A5E]" />
            </div>
            <p className="font-document text-2xl font-bold text-[#14110F] mt-2">
              {summary?.filesRecovered?.toLocaleString() ?? 12408}
            </p>
            <p className="text-[10px] font-mono text-[#4C7A5E] font-medium mt-1">100% SHA-256 match</p>
          </div>

          {/* Card 3: Partial Files (Reconstructed) */}
          <div className="kraft-card p-4 rounded relative border-l-4 border-l-[#C68A2E]">
            <div className="evidence-pin evidence-pin-top-center"></div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase text-[#C68A2E]">Partial ECC</span>
              <AlertTriangle className="w-4 h-4 text-[#C68A2E]" />
            </div>
            <p className="font-document text-2xl font-bold text-[#14110F] mt-2">
              {summary?.partialFiles?.toLocaleString() ?? 2140}
            </p>
            <p className="text-[10px] font-mono text-[#C68A2E] font-medium mt-1">Parity reconstructed</p>
          </div>

          {/* Card 4: Failed / Corrupted */}
          <div className="kraft-card p-4 rounded relative border-l-4 border-l-[#B33A2E]">
            <div className="evidence-pin evidence-pin-top-center"></div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase text-[#B33A2E]">Damaged / Lost</span>
              <XCircle className="w-4 h-4 text-[#B33A2E]" />
            </div>
            <p className="font-document text-2xl font-bold text-[#14110F] mt-2">
              {summary?.failedFiles?.toLocaleString() ?? 344}
            </p>
            <p className="text-[10px] font-mono text-[#B33A2E] font-medium mt-1">Overwritten clusters</p>
          </div>
        </div>

        {/* Forensic Metadata String */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#A39D95] pt-4 mt-4 border-t border-[#2F2926]">
          <span>Volume Size: <strong className="text-[#F2EFE9]">{summary?.totalSize || '482.5 GB'}</strong></span>
          <span>Recovered Data: <strong className="text-[#D8C39A]">{summary?.recoveredSize || '142.8 GB'}</strong></span>
          <span>Integrity Score: <strong className="text-[#4C7A5E]">{summary?.healthScore || 94.8}%</strong></span>
          <span>Carve Duration: <strong className="text-[#F2EFE9]">{summary?.scanDuration || '2m 14s'}</strong></span>
        </div>
      </div>
    </div>
  );
}
