import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getScanResults } from '../services/api';
import ScanSummary from '../components/ScanSummary';
import ArtifactTable from '../components/ArtifactTable';
import { ArrowLeft, HardDrive, Loader2, AlertCircle, FileCode, CheckCircle2, Download } from 'lucide-react';

export default function ScanResults() {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJsonModal, setShowJsonModal] = useState(false);

  useEffect(() => {
    async function loadResults() {
      setLoading(true);
      setError(null);
      try {
        const result = await getScanResults(scanId);
        setData(result);
      } catch (err) {
        setError(err.message || "Failed to load scan results");
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [scanId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading scan results for {scanId}...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-rose-500/30 text-center max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white">Scan Result Not Found</h2>
        <p className="text-xs text-slate-400 mt-1">{error || "Could not retrieve ledger data for this scan ID."}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">
              Scan Results: <span className="font-mono text-sky-400">{scanId}</span>
            </h1>
            <p className="text-xs text-slate-400">
              Detailed artifact inspection and cryptographic hash ledger.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJsonModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 transition cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            View Raw API JSON
          </button>
        </div>
      </div>

      {/* 1. Summary Cards */}
      <ScanSummary scanData={data} onReset={() => navigate('/')} />

      {/* 2. Detailed Artifacts Table */}
      <ArtifactTable artifacts={data?.artifacts || []} />

      {/* Raw JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sky-400" />
                API Contract JSON ({scanId})
              </h3>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="flex-1 overflow-auto mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
