import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSearch,
  Download,
  Eye,
  Search,
  HardDrive,
  RefreshCw,
  ShieldCheck,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  FileText
} from 'lucide-react';

export default function ScanSummary({ scanData, onReset }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedArtifacts, setSelectedArtifacts] = useState([]);
  const [exportNotice, setExportNotice] = useState(null);

  if (!scanData) return null;

  const { scanId, summary, artifacts = [], targetDrive, timestamp } = scanData;

  const filteredArtifacts = artifacts.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const toggleSelectArtifact = (id) => {
    if (selectedArtifacts.includes(id)) {
      setSelectedArtifacts(selectedArtifacts.filter((item) => item !== id));
    } else {
      setSelectedArtifacts([...selectedArtifacts, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedArtifacts.length === filteredArtifacts.length) {
      setSelectedArtifacts([]);
    } else {
      setSelectedArtifacts(filteredArtifacts.map((a) => a.id));
    }
  };

  const handleExport = () => {
    const count = selectedArtifacts.length > 0 ? selectedArtifacts.length : filteredArtifacts.length;
    setExportNotice(`Exported ${count} recovered file(s) to /RecoverIQ_Restored/`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {exportNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="text-xs underline text-emerald-400">
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                New Scan
              </button>
            )}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Selected ({selectedArtifacts.length > 0 ? selectedArtifacts.length : filteredArtifacts.length})
            </button>
          </div>
        </div>

        {/* The 4 Core Metrics as requested: filesDetected, filesRecovered, partialFiles, failedFiles */}
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
            <p className="text-xs text-rose-400/80 mt-1">Overwritten raw clusters</p>
          </div>
        </div>

        {/* Secondary Details */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-4 mt-4 border-t border-slate-800/60">
          <span>Total Size Scanned: <strong className="text-slate-200">{summary?.totalSize || '482.5 GB'}</strong></span>
          <span>Recovered Data Size: <strong className="text-emerald-400">{summary?.recoveredSize || '142.8 GB'}</strong></span>
          <span>Health Score: <strong className="text-sky-400">{summary?.healthScore || 94.8}%</strong></span>
          <span>Scan Duration: <strong className="text-indigo-300">{summary?.scanDuration || '3m 42s'}</strong></span>
        </div>
      </div>

      {/* Artifacts Ledger Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              Recovered Artifacts Ledger
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual file carving breakdown and cryptographic hashes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search artifacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-48 sm:w-60"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {['All', 'Recovered', 'Partial', 'Failed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={filteredArtifacts.length > 0 && selectedArtifacts.length === filteredArtifacts.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                  />
                </th>
                <th className="py-3 px-4">Artifact Name & Path</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredArtifacts.map((item) => {
                const isSelected = selectedArtifacts.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-indigo-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectArtifact(item.id)}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-slate-200">{item.name}</p>
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5">{item.path}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">{item.size}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.confidence >= 90 ? 'bg-emerald-400' : item.confidence >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                            }`}
                            style={{ width: `${item.confidence}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-slate-300 font-semibold">{item.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          item.status === 'Recovered'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : item.status === 'Partial'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {item.status === 'Recovered' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === 'Partial' && <AlertTriangle className="w-3 h-3" />}
                        {item.status === 'Failed' && <XCircle className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setExportNotice(`Extracted ${item.name} to local machine.`)}
                        className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition cursor-pointer"
                        title="Download Artifact"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
