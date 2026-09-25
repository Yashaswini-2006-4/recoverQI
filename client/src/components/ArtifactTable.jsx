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
  Eye,
  Tag,
  Pin,
  FileCheck
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
    const dummyContent = `--- RECOVERIQ FORENSIC CASE LOG ---\nCase Item: ${item.name}\nVolume Path: ${item.path}\nIntegrity State: ${item.integrity}\nSHA-256 Hash: ${item.checksum}\nCarved At: ${item.recoveredAt || new Date().toISOString()}\n--- END OF EVIDENCE RECORD ---`;
    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadAlert(`Downloaded evidence item: ${item.name}`);
    setTimeout(() => setDownloadAlert(null), 3000);

    if (onDownload) {
      onDownload(item);
    }
  };

  const handleBatchDownload = () => {
    const count = selectedIds.length > 0 ? selectedIds.length : filteredArtifacts.length;
    setDownloadAlert(`Exporting case envelope with ${count} evidence files.`);
    setTimeout(() => setDownloadAlert(null), 3500);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#B33A2E]/15 text-[#B33A2E] border border-[#B33A2E]/30">High Priority</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C68A2E]/15 text-[#C68A2E] border border-[#C68A2E]/30">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#A39D95] bg-[#25201D] border border-[#3A332F]">Low</span>;
    }
  };

  const renderTypeIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('image')) return <ImageIcon className="w-4 h-4 text-[#4C7A5E]" />;
    if (t.includes('pdf')) return <FileText className="w-4 h-4 text-[#B33A2E]" />;
    if (t.includes('sheet') || t.includes('xls')) return <FileSpreadsheet className="w-4 h-4 text-[#D8C39A]" />;
    if (t.includes('data') || t.includes('sql') || t.includes('db')) return <Database className="w-4 h-4 text-[#A39D95]" />;
    if (t.includes('arch') || t.includes('tar') || t.includes('zip')) return <FileArchive className="w-4 h-4 text-[#C68A2E]" />;
    return <FileCode className="w-4 h-4 text-[#F2EFE9]" />;
  };

  return (
    <div className="ink-card rounded-lg p-6 sm:p-8 border border-[#2F2926] relative space-y-4">
      {/* Evidence Board Pin */}
      <div className="evidence-pin evidence-pin-top-left"></div>

      {/* Toast Alert */}
      {downloadAlert && (
        <div className="p-3 rounded bg-[#171412] border border-[#4C7A5E]/50 text-[#4C7A5E] text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{downloadAlert}</span>
          </div>
          <button onClick={() => setDownloadAlert(null)} className="underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2F2926] pl-3">
        <div>
          <h3 className="font-document text-xl font-bold text-[#F2EFE9] flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#B33A2E]" />
            Evidence Inventory & Case Log
          </h3>
          <p className="text-xs text-[#A39D95] mt-0.5">
            Documented artifacts recovered from volume sectors. Click redaction bars to verify signatures.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#A39D95] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search case log..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded bg-[#171412] border border-[#3A332F] text-xs text-[#F2EFE9] placeholder-[#5A524C] focus:outline-none focus:border-[#B39F73] w-44 sm:w-52 font-mono"
            />
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-[#171412] border border-[#3A332F] text-xs font-mono text-[#F2EFE9] focus:outline-none focus:border-[#B39F73]"
          >
            <option value="All">All Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Batch export */}
          <button
            onClick={handleBatchDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#25201D] hover:bg-[#2F2926] text-[#D8C39A] text-xs font-mono border border-[#B39F73]/40 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Selected ({selectedIds.length > 0 ? selectedIds.length : filteredArtifacts.length})
          </button>
        </div>
      </div>

      {/* Case Log Table on Kraft Styling */}
      <div className="overflow-x-auto max-w-full rounded border border-[#B39F73]/30 bg-[#D8C39A]">
        <table className="w-full text-left border-collapse min-w-[640px] text-[#14110F]">
          <thead>
            <tr className="border-b border-[#B39F73] bg-[#C9B489] text-[11px] font-document font-bold text-[#14110F] uppercase tracking-wider">
              <th className="py-2.5 px-3 w-10">
                <input
                  type="checkbox"
                  checked={filteredArtifacts.length > 0 && selectedIds.length === filteredArtifacts.length}
                  onChange={toggleSelectAll}
                  className="rounded border-[#B39F73] text-[#B33A2E] focus:ring-[#B33A2E]"
                />
              </th>
              <th className="py-2.5 px-3">Evidence Item & Path</th>
              <th className="py-2.5 px-3">Format</th>
              <th className="py-2.5 px-3">Size</th>
              <th className="py-2.5 px-3">Integrity State</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#B39F73]/40 text-xs">
            {filteredArtifacts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#4A5560] font-mono">
                  No evidence items matching current query.
                </td>
              </tr>
            ) : (
              filteredArtifacts.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#E8DCC2]/60 transition-colors ${
                      isSelected ? 'bg-[#E8DCC2]' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(item.id)}
                        className="rounded border-[#B39F73] text-[#B33A2E] focus:ring-[#B33A2E]"
                      />
                    </td>

                    {/* Name + Thumbnail/Preview */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        {item.previewUrl ? (
                          <div
                            onClick={() => setPreviewItem(item)}
                            className="w-11 h-8 rounded overflow-hidden border border-[#B39F73] bg-[#14110F] flex-shrink-0 cursor-pointer shadow-sm hover:scale-105 transition"
                            title="Click to inspect evidence image"
                          >
                            <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div
                            onClick={() => setPreviewItem(item)}
                            className="w-8 h-8 rounded border border-[#B39F73] bg-[#E8DCC2] flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-[#F2EFE9]"
                          >
                            {renderTypeIcon(item.type)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p
                            onClick={() => setPreviewItem(item)}
                            className="font-document font-bold text-sm text-[#14110F] hover:text-[#B33A2E] cursor-pointer truncate max-w-xs"
                          >
                            {item.name}
                          </p>
                          <p className="text-[10px] font-mono text-[#4A5560] truncate max-w-xs">{item.path}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-[#4A5560]">{item.type}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#14110F] font-semibold">{item.size}</td>

                    {/* Integrity with Redaction Bar */}
                    <td className="py-3 px-3">
                      <IntegrityBadge integrity={item.integrity} confidence={item.confidence} />
                    </td>

                    <td className="py-3 px-3">
                      {getPriorityBadge(item.priority)}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-1 rounded bg-[#E8DCC2] hover:bg-[#F2EFE9] text-[#14110F] border border-[#B39F73] transition cursor-pointer"
                          title="Inspect Evidence Item"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownload(item)}
                          className="p-1 rounded bg-[#B33A2E] hover:bg-[#9B2F25] text-[#F2EFE9] transition cursor-pointer"
                          title="Download Evidence File"
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

      {/* Pinned Evidence Inspector Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="kraft-card w-full max-w-lg rounded-lg p-6 relative shadow-2xl border-2 border-[#B39F73] space-y-4">
            {/* Red pushpin */}
            <div className="evidence-pin evidence-pin-top-center"></div>

            <div className="flex items-center justify-between pb-3 border-b border-[#B39F73]">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#B33A2E]" />
                <h4 className="font-document text-base font-bold text-[#14110F]">Evidence Item #{previewItem.id}</h4>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-xs font-mono px-2 py-1 rounded bg-[#C9B489] hover:bg-[#B39F73] text-[#14110F] cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Thumbnail Preview */}
            {previewItem.previewUrl ? (
              <div className="p-3 bg-[#14110F] rounded border border-[#B39F73] flex flex-col items-center justify-center">
                <img src={previewItem.previewUrl} alt={previewItem.name} className="max-h-44 rounded object-contain" />
                <span className="text-[10px] text-[#A39D95] font-mono mt-1">Carved Visual Cluster Stream</span>
              </div>
            ) : (
              <div className="p-4 bg-[#E8DCC2] rounded border border-[#B39F73] text-center">
                <p className="font-document text-sm font-bold text-[#14110F]">{previewItem.name}</p>
                <p className="text-[11px] font-mono text-[#4A5560]">{previewItem.type} • {previewItem.size}</p>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#4A5560]">Original Volume Node</span>
                <p className="font-mono text-[11px] text-[#14110F] bg-[#E8DCC2] p-1.5 rounded border border-[#B39F73] mt-0.5">
                  {previewItem.path}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#E8DCC2] p-2 rounded border border-[#B39F73]">
                  <span className="text-[10px] font-mono uppercase text-[#4A5560]">Integrity Check:</span>
                  <div className="mt-1">
                    <IntegrityBadge integrity={previewItem.integrity} confidence={previewItem.confidence} />
                  </div>
                </div>
                <div className="bg-[#E8DCC2] p-2 rounded border border-[#B39F73]">
                  <span className="text-[10px] font-mono uppercase text-[#4A5560]">Triage Priority:</span>
                  <div className="mt-1 font-mono font-bold text-[#14110F]">
                    {previewItem.priority}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#4A5560]">SHA-256 Signature</span>
                <p className="font-mono text-[10px] text-[#B33A2E] bg-[#14110F] p-2 rounded border border-[#2F2926] break-all mt-0.5 font-bold">
                  {previewItem.checksum}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#B39F73]">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-3 py-1.5 rounded bg-[#C9B489] hover:bg-[#B39F73] text-[#14110F] text-xs font-mono cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(previewItem);
                  setPreviewItem(null);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#B33A2E] hover:bg-[#9B2F25] text-[#F2EFE9] text-xs font-document font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
