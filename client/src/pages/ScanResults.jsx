import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getScanResults, downloadReport } from '../services/api';
import ScanSummary from '../components/ScanSummary';
import ArtifactTable from '../components/ArtifactTable';
import { ArrowLeft, Tag, Pin, Download, FileCode, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';

export default function ScanResults() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function loadResults() {
      setLoading(true);
      setError(null);
      try {
        const result = await getScanResults(scanId);
        setData(result);
      } catch (err) {
        setError(err.message || "Failed to load case docket");
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [scanId]);

  const handleDownloadReport = async () => {
    setIsExporting(true);
    try {
      await downloadReport(scanId);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-6 h-6 border-2 border-[#B33A2E] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-xs text-[#A39D95]">Opening forensic case docket #{scanId}...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="ink-card p-8 rounded-lg text-center max-w-md mx-auto border border-[#B33A2E]/40">
        <h3 className="font-document text-lg font-bold text-[#F2EFE9]">Case Docket Not Found</h3>
        <p className="text-xs font-mono text-[#A39D95] mt-1">{error || "Could not locate evidence records for this scan ID."}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded bg-[#25201D] text-[#D8C39A] text-xs font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Evidence Board
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Official Case File Cover Page Block */}
      <div className="kraft-card rounded-lg p-6 sm:p-8 relative border-2 border-[#B39F73] shadow-lg">
        {/* Red Pushpin at top center */}
        <div className="evidence-pin evidence-pin-top-center"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#B39F73] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rubber-stamp text-xs">
                CASE REPORT #{scanId}
              </span>
              <span className="rubber-stamp-verified text-xs">
                NIST-800-88 VERIFIED
              </span>
            </div>
            <h1 className="font-document text-2xl font-bold text-[#14110F] mt-2">
              Forensic Investigation & Artifact Docket
            </h1>
            <p className="text-xs font-mono text-[#4A5560] mt-1">
              Cryptographic evidence ledger and cluster reconstruction records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJsonModal(true)}
              className="px-3 py-1.5 rounded bg-[#E8DCC2] hover:bg-[#F2EFE9] text-[#14110F] text-xs font-mono border border-[#B39F73] cursor-pointer"
            >
              Raw Ledger JSON
            </button>
            <button
              onClick={handleDownloadReport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded bg-[#B33A2E] hover:bg-[#9B2F25] text-[#F2EFE9] text-xs font-document font-bold shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {isExporting ? "Generating..." : "Download Full Case Report"}
            </button>
          </div>
        </div>

        {/* Docket Summary Table on Kraft */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono text-[#14110F]">
          <div className="p-2.5 bg-[#E8DCC2] rounded border border-[#B39F73]">
            <span className="text-[10px] text-[#4A5560] uppercase block">Files Detected:</span>
            <span className="font-bold text-sm">{data.summary?.filesDetected?.toLocaleString()}</span>
          </div>
          <div className="p-2.5 bg-[#E8DCC2] rounded border border-[#B39F73]">
            <span className="text-[10px] text-[#4C7A5E] uppercase block font-bold">Verified Recovered:</span>
            <span className="font-bold text-sm text-[#4C7A5E]">{data.summary?.filesRecovered?.toLocaleString()}</span>
          </div>
          <div className="p-2.5 bg-[#E8DCC2] rounded border border-[#B39F73]">
            <span className="text-[10px] text-[#C68A2E] uppercase block font-bold">Partial Chains:</span>
            <span className="font-bold text-sm text-[#C68A2E]">{data.summary?.partialFiles?.toLocaleString()}</span>
          </div>
          <div className="p-2.5 bg-[#E8DCC2] rounded border border-[#B39F73]">
            <span className="text-[10px] text-[#B33A2E] uppercase block font-bold">Failed Clusters:</span>
            <span className="font-bold text-sm text-[#B33A2E]">{data.summary?.failedFiles?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Artifacts Table */}
      <ArtifactTable artifacts={data.artifacts || []} />

      {/* Raw JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="kraft-card w-full max-w-2xl max-h-[80vh] flex flex-col rounded-lg p-6 relative border-2 border-[#B39F73]">
            <div className="evidence-pin evidence-pin-top-center"></div>
            <div className="flex items-center justify-between pb-3 border-b border-[#B39F73]">
              <h4 className="font-document text-base font-bold text-[#14110F]">Evidence JSON Ledger ({scanId})</h4>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-xs font-mono px-2 py-1 rounded bg-[#C9B489] text-[#14110F] cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="flex-1 overflow-auto mt-4 p-3 rounded bg-[#14110F] border border-[#2F2926] font-mono text-[11px] text-[#D8C39A]">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
