import React, { useState } from 'react';
import IntegrityBadge from './IntegrityBadge';
import {
  Download,
  Search,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  FileText,
  Database,
  Image as ImageIcon,
  CheckCircle2,
  ShieldCheck,
  Eye,
  ExternalLink,
  Layers
} from 'lucide-react';

export default function ArtifactTable({ artifacts = [], onDownload }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState([]);
  const [previewItem, setPreviewItem] = useState(null);
  const [downloadAlert, setDownloadAlert] = useState(null);

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

  const handleDownload = (item) => {
    // Generate a downloadable text/blob artifact
    const dummyContent = `--- RECOVERIQ FORENSIC EXTRACTION ---\nArtifact Name: ${item.name}\nSource Path: ${item.path}\nIntegrity: ${item.integrity}\nSHA-256: ${item.checksum}\nExtracted At: ${item.recoveredAt || new Date().toISOString()}\n--- CARVED BITSTREAM DATA SIMULATION ---`;
    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadAlert(`Downloaded ${item.name}`);
    setTimeout(() => setDownloadAlert(null), 3000);

    if (onDownload) {
      onDownload(item);
    }
  };

  const handleBatchDownload = () => {
    const count = selectedIds.length > 0 ? selectedIds.length : filteredArtifacts.length;
    setDownloadAlert(`Exporting package: ${count} artifacts compressed into RecoverIQ_Archive.zip`);
    setTimeout(() => setDownloadAlert(null), 4000);
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

  const renderTypeIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('image')) return <ImageIcon className="w-4 h-4 text-emerald-400" />;
    if (t.includes('pdf')) return <FileText className="w-4 h-4 text-rose-400" />;
    if (t.includes('sheet') || t.includes('xls')) return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
    if (t.includes('data') || t.includes('sql') || t.includes('db')) return <Database className="w-4 h-4 text-sky-400" />;
    if (t.includes('arch') || t.includes('tar') || t.includes('zip')) return <FileArchive className="w-4 h-4 text-amber-400" />;
    return <FileCode className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
      {/* Toast Notification */}
      {downloadAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs animate-fade-in">
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
            Recovered Artifacts Ledger & Previews
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Displaying {filteredArtifacts.length} carved objects. Click any item to inspect metadata or download.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by file name or path..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-48 sm:w-56"
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
                className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Export Selected */}
          <button
            onClick={handleBatchDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export ({selectedIds.length > 0 ? selectedIds.length : filteredArtifacts.length})
          </button>
        </div>
      </div>

      {/* Artifacts Table with Horizontal Overflow Wrapper */}
      <div className="overflow-x-auto max-w-full -mx-2 sm:mx-0">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3 w-10">
                <input
                  type="checkbox"
                  checked={filteredArtifacts.length > 0 && selectedIds.length === filteredArtifacts.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                />
              </th>
              <th className="py-3 px-3">Artifact & Preview</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Size</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Integrity</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredArtifacts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                  No artifacts found matching your filter criteria.
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
                    <td className="py-3.5 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(item.id)}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                      />
                    </td>

                    {/* Name + Thumbnail/Preview */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        {item.previewUrl ? (
                          <div
                            onClick={() => setPreviewItem(item)}
                            className="w-12 h-9 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 flex-shrink-0 cursor-pointer hover:border-sky-400 transition"
                            title="Click to view image thumbnail"
                          >
                            <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div
                            onClick={() => setPreviewItem(item)}
                            className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900/80 flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-slate-700"
                          >
                            {renderTypeIcon(item.type)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p
                            onClick={() => setPreviewItem(item)}
                            className="font-semibold text-slate-200 hover:text-sky-400 cursor-pointer truncate max-w-xs"
                          >
                            {item.name}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500 truncate max-w-xs">{item.path}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {item.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-300">{item.size}</td>

                    <td className="py-3.5 px-3 text-slate-300 font-medium">
                      {item.status}
                    </td>

                    <td className="py-3.5 px-3">
                      <IntegrityBadge integrity={item.integrity} />
                    </td>

                    <td className="py-3.5 px-3">
                      {getPriorityBadge(item.priority)}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                          title="Preview artifact details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownload(item)}
                          className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition cursor-pointer"
                          title="Download file"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Interactive Modal Preview */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {renderTypeIcon(previewItem.type)}
                <h4 className="text-sm font-bold text-white">Artifact Inspector & Preview</h4>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Thumbnail Preview Area */}
            {previewItem.previewUrl ? (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                <img src={previewItem.previewUrl} alt={previewItem.name} className="max-h-48 rounded-lg object-contain" />
                <span className="text-[10px] text-slate-500 mt-2 font-mono">Decoded Visual Cluster Stream</span>
              </div>
            ) : (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-sky-400">
                  {renderTypeIcon(previewItem.type)}
                </div>
                <p className="text-xs font-semibold text-slate-200">{previewItem.name}</p>
                <p className="text-[11px] text-slate-400 font-mono">Format: {previewItem.type} • {previewItem.size}</p>
              </div>
            )}

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400">Original Volume Path</span>
                <p className="font-mono text-[11px] text-slate-200 bg-slate-900 p-2 rounded border border-slate-800 mt-0.5">
                  {previewItem.path}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Integrity:</span>
                  <div className="mt-1">
                    <IntegrityBadge integrity={previewItem.integrity} />
                  </div>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Priority:</span>
                  <div className="mt-1">
                    {getPriorityBadge(previewItem.priority)}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-400">SHA-256 Checksum</span>
                <p className="font-mono text-[10px] text-sky-400 bg-slate-900 p-2 rounded border border-slate-800 break-all mt-0.5">
                  {previewItem.checksum}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(previewItem);
                  setPreviewItem(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download This Artifact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
