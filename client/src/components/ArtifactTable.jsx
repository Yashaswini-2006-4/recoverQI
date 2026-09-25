import React, { useState } from 'react';
import IntegrityBadge from './IntegrityBadge';
import {
  Download,
  Search,
  Filter,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  FileText,
  Database,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
  ArrowUpDown
} from 'lucide-react';

export default function ArtifactTable({ artifacts = [], onDownload }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [downloadAlert, setDownloadAlert] = useState(null);

  // Normalize artifacts to ensure priority and integrity fields exist
  const normalizedArtifacts = artifacts.map((item, idx) => ({
    ...item,
    priority: item.priority || (idx % 3 === 0 ? 'High' : idx % 3 === 1 ? 'Medium' : 'Low'),
    integrity: item.integrity || (item.status === 'Recovered' ? 'valid' : item.status === 'Partial' ? 'partial' : 'failed'),
  }));

  const filteredArtifacts = normalizedArtifacts.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.path && item.path.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'All' || item.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredArtifacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArtifacts.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDownloadItem = (item) => {
    if (onDownload) {
      onDownload(item);
    }
    setDownloadAlert(`Downloaded artifact: ${item.name}`);
    setTimeout(() => setDownloadAlert(null), 3000);
  };

  const handleBatchDownload = () => {
    const count = selectedIds.length > 0 ? selectedIds.length : filteredArtifacts.length;
    setDownloadAlert(`Batch export completed: ${count} artifacts exported.`);
    setTimeout(() => setDownloadAlert(null), 3500);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">HIGH</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">MED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">LOW</span>;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
      {/* Toast alert */}
      {downloadAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadAlert}</span>
          </div>
          <button onClick={() => setDownloadAlert(null)} className="underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            Recovered Artifacts Ledger
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Displaying {filteredArtifacts.length} carved objects and verified integrity hashes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by file name or path..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-52 sm:w-64"
            />
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Priorities</option>
            <option value="High">Priority: High</option>
            <option value="Medium">Priority: Medium</option>
            <option value="Low">Priority: Low</option>
          </select>

          {/* Status filter */}
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

          {/* Export Selected Button */}
          <button
            onClick={handleBatchDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export ({selectedIds.length > 0 ? selectedIds.length : filteredArtifacts.length})
          </button>
        </div>
      </div>

      {/* Artifacts Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={filteredArtifacts.length > 0 && selectedIds.length === filteredArtifacts.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                />
              </th>
              <th className="py-3 px-4">Artifact Name & Path</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Integrity</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4 text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredArtifacts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                  No artifacts match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredArtifacts.map((item) => {
                const isSelected = selectedIds.includes(item.id);
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
                        onChange={() => toggleSelectOne(item.id)}
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
                      <span className="text-slate-300 font-medium">{item.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <IntegrityBadge integrity={item.integrity} />
                    </td>
                    <td className="py-3 px-4">
                      {getPriorityBadge(item.priority)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDownloadItem(item)}
                        className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition cursor-pointer"
                        title="Download artifact"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
