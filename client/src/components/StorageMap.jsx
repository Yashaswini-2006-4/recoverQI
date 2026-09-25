import React, { useState } from 'react';
import { HardDrive, Info, Layers, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, FileText } from 'lucide-react';

const blockData = [
  { id: 1, offset: '0x00000000', size: '64 KB', type: 'recognized', label: 'NTFS Boot Sector (VBR)', artifact: 'Filesystem Header', status: 'Healthy', confidence: 100 },
  { id: 2, offset: '0x00010000', size: '128 KB', type: 'recovered', label: 'MFT Record #0', artifact: 'Master File Table', status: 'Recovered', confidence: 99 },
  { id: 3, offset: '0x00030000', size: '256 KB', type: 'recovered', label: 'Inode Chain F-01', artifact: 'financial_ledger.xlsx', status: 'Recovered', confidence: 98 },
  { id: 4, offset: '0x00070000', size: '64 KB', type: 'damaged', label: 'Bad Parity Block', artifact: 'Corrupted Inode #41', status: 'Damaged', confidence: 42 },
  { id: 5, offset: '0x00080000', size: '512 KB', type: 'unclassified', label: 'Unallocated Cluster', artifact: 'None', status: 'Free', confidence: 0 },
  { id: 6, offset: '0x00100000', size: '1 MB', type: 'recognized', label: 'SQL Table Header', artifact: 'contracts.db', status: 'Healthy', confidence: 97 },
  { id: 7, offset: '0x00200000', size: '2 MB', type: 'recovered', label: 'JPEG Chunk [FF D8]', artifact: 'evidence_photo.jpg', status: 'Recovered', confidence: 95 },
  { id: 8, offset: '0x00400000', size: '512 KB', type: 'recovered', label: 'ZIP Local File Header', artifact: 'sys_backup.tar.gz', status: 'Recovered', confidence: 92 },
  { id: 9, offset: '0x00480000', size: '64 KB', type: 'damaged', label: 'CRC Mismatch Block', artifact: 'Partial Archive F-04', status: 'Damaged', confidence: 35 },
  { id: 10, offset: '0x00490000', size: '128 KB', type: 'unclassified', label: 'Slack Space Zeroes', artifact: 'None', status: 'Free', confidence: 0 },
  { id: 11, offset: '0x004B0000', size: '2 MB', type: 'recognized', label: 'PDF Stream Object', artifact: 'architecture.pdf', status: 'Healthy', confidence: 100 },
  { id: 12, offset: '0x006B0000', size: '4 MB', type: 'recovered', label: 'Model Weights Binary', artifact: 'weights.bin', status: 'Recovered', confidence: 98 },
  // Generate remaining sectors for realistic grid density
  ...Array.from({ length: 108 }).map((_, i) => {
    const id = i + 13;
    const types = ['recognized', 'recovered', 'recovered', 'damaged', 'unclassified', 'unclassified', 'recognized'];
    const selectedType = types[i % types.length];
    const offsetHex = '0x' + (0x00700000 + i * 0x00020000).toString(16).toUpperCase();
    return {
      id,
      offset: offsetHex,
      size: `${Math.pow(2, (i % 5) + 4)} KB`,
      type: selectedType,
      label: selectedType === 'recovered' ? `Carved Fragment F-${id}` : selectedType === 'damaged' ? `Parity Error Cluster #${id}` : selectedType === 'recognized' ? `Valid Data Stream #${id}` : 'Unallocated Bitstream',
      artifact: selectedType === 'recovered' ? `artifact_obj_${id}.dat` : selectedType === 'recognized' ? `vol_cluster_${id}.sys` : 'None',
      status: selectedType === 'recovered' ? 'Recovered' : selectedType === 'damaged' ? 'Damaged' : selectedType === 'recognized' ? 'Healthy' : 'Free',
      confidence: selectedType === 'recovered' ? 90 + (i % 10) : selectedType === 'damaged' ? 30 + (i % 20) : selectedType === 'recognized' ? 99 : 0
    };
  })
];

export default function StorageMap({ onSelectBlock }) {
  const [selectedBlock, setSelectedBlock] = useState(blockData[2]); // default selected block
  const [filterType, setFilterType] = useState('all');

  const getColorClasses = (type) => {
    switch (type) {
      case 'recognized':
        return 'bg-sky-500 hover:bg-sky-400 border-sky-400/40 text-sky-200';
      case 'recovered':
        return 'bg-emerald-500 hover:bg-emerald-400 border-emerald-400/40 text-emerald-200';
      case 'damaged':
        return 'bg-rose-500 hover:bg-rose-400 border-rose-400/40 text-rose-200';
      case 'unclassified':
      default:
        return 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-400';
    }
  };

  const filteredBlocks = blockData.filter(b => filterType === 'all' || b.type === filterType);

  const stats = {
    recognized: blockData.filter(b => b.type === 'recognized').length,
    recovered: blockData.filter(b => b.type === 'recovered').length,
    damaged: blockData.filter(b => b.type === 'damaged').length,
    unclassified: blockData.filter(b => b.type === 'unclassified').length,
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            Storage Map Digital Twin (Sector Cluster Grid)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual cluster-by-cluster memory allocation map. Click any cluster block to inspect byte offsets.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filterType === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Blocks ({blockData.length})
          </button>
          <button
            onClick={() => setFilterType('recovered')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition ${
              filterType === 'recovered' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Recovered ({stats.recovered})
          </button>
          <button
            onClick={() => setFilterType('recognized')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition ${
              filterType === 'recognized' ? 'bg-sky-600 text-white' : 'text-sky-400 hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            Recognized ({stats.recognized})
          </button>
          <button
            onClick={() => setFilterType('damaged')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition ${
              filterType === 'damaged' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            Damaged ({stats.damaged})
          </button>
        </div>
      </div>

      {/* Grid Layout & Inspector Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left 2 Cols: The Visual Cluster Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 overflow-x-auto max-w-full">
            <div className="grid grid-cols-12 sm:grid-cols-20 gap-1.5 min-w-[320px]">
              {filteredBlocks.map((block) => {
                const isSelected = selectedBlock?.id === block.id;
                return (
                  <button
                    key={block.id}
                    onClick={() => {
                      setSelectedBlock(block);
                      if (onSelectBlock) onSelectBlock(block);
                    }}
                    title={`Offset: ${block.offset} | ${block.label}`}
                    className={`h-6 rounded-[3px] border transition-all cursor-pointer ${getColorClasses(block.type)} ${
                      isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110 z-10' : 'opacity-85 hover:opacity-100 hover:scale-110'
                    }`}
                  ></button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[2px] bg-sky-500"></span> Recognized Data
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[2px] bg-emerald-500"></span> Recovered Fragment
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[2px] bg-rose-500"></span> Damaged / Parity Bad
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[2px] bg-slate-700"></span> Unclassified / Free
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Interactive Cluster Popover / Inspector Card */}
        <div className="glass-panel p-5 rounded-xl border border-slate-700/80 bg-slate-900/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-sky-400">CLUSTER INSPECTOR</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                Block #{selectedBlock?.id || 1}
              </span>
            </div>

            {selectedBlock ? (
              <div className="space-y-3.5 mt-4 text-xs">
                <div>
                  <span className="text-slate-400">Byte Offset Range</span>
                  <p className="font-mono text-white text-sm font-semibold mt-0.5 bg-slate-950 p-2 rounded border border-slate-800">
                    {selectedBlock.offset}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400">Block Size</span>
                    <p className="font-mono text-slate-200 font-bold mt-0.5">{selectedBlock.size}</p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400">Confidence</span>
                    <p className="font-mono text-emerald-400 font-bold mt-0.5">{selectedBlock.confidence}%</p>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Detected Signature / Label</span>
                  <p className="font-medium text-slate-200 mt-0.5">{selectedBlock.label}</p>
                </div>

                <div>
                  <span className="text-slate-400">Linked Artifact Object</span>
                  <p className="font-mono text-sky-300 mt-0.5">{selectedBlock.artifact}</p>
                </div>

                <div>
                  <span className="text-slate-400">Cluster Status</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        selectedBlock.type === 'recovered' || selectedBlock.type === 'recognized'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : selectedBlock.type === 'damaged'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {selectedBlock.type === 'recovered' || selectedBlock.type === 'recognized' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : selectedBlock.type === 'damaged' ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <Info className="w-3.5 h-3.5" />
                      )}
                      {selectedBlock.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-8 text-center">Click a sector block to inspect.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
            Direct Memory I/O • Forensic Bitstream Map
          </div>
        </div>
      </div>
    </div>
  );
}
