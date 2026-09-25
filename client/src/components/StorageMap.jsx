import React, { useState } from 'react';
import { Tag, Layers, CheckCircle2, AlertTriangle, XCircle, Pin, Info } from 'lucide-react';

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
  ...Array.from({ length: 84 }).map((_, i) => {
    const id = i + 13;
    const types = ['recognized', 'recovered', 'recovered', 'damaged', 'unclassified', 'unclassified', 'recognized'];
    const selectedType = types[i % types.length];
    const offsetHex = '0x' + (0x00700000 + i * 0x00020000).toString(16).toUpperCase();
    return {
      id,
      offset: offsetHex,
      size: `${Math.pow(2, (i % 4) + 5)} KB`,
      type: selectedType,
      label: selectedType === 'recovered' ? `Carved Clue #${id}` : selectedType === 'damaged' ? `Parity Break #${id}` : selectedType === 'recognized' ? `Valid Sector #${id}` : 'Slack Space',
      artifact: selectedType === 'recovered' ? `evidence_blob_${id}.dat` : selectedType === 'recognized' ? `vol_cluster_${id}.sys` : 'None',
      status: selectedType === 'recovered' ? 'Recovered' : selectedType === 'damaged' ? 'Damaged' : selectedType === 'recognized' ? 'Healthy' : 'Free',
      confidence: selectedType === 'recovered' ? 92 + (i % 8) : selectedType === 'damaged' ? 32 + (i % 18) : selectedType === 'recognized' ? 99 : 0
    };
  })
];

export default function StorageMap({ onSelectBlock }) {
  const [selectedBlock, setSelectedBlock] = useState(blockData[2]);
  const [filterType, setFilterType] = useState('all');

  const getTileClasses = (type) => {
    switch (type) {
      case 'recognized':
        return 'bg-[#D8C39A] border-[#B39F73] text-[#14110F] shadow-sm';
      case 'recovered':
        return 'bg-[#4C7A5E] border-[#385C46] text-[#F2EFE9] shadow-sm';
      case 'damaged':
        return 'bg-[#B33A2E] border-[#8A2B21] text-[#F2EFE9] shadow-sm';
      case 'unclassified':
      default:
        return 'bg-[#1C1816] border-[#2F2926] text-[#4A5560]';
    }
  };

  const filteredBlocks = blockData.filter(b => filterType === 'all' || b.type === filterType);

  return (
    <div className="ink-card rounded-lg p-6 sm:p-8 border border-[#2F2926] relative space-y-6">
      {/* Evidence Pushpin */}
      <div className="evidence-pin evidence-pin-top-left"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#2F2926] pl-3">
        <div>
          <h3 className="font-document text-xl font-bold text-[#F2EFE9] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#B33A2E]" />
            Storage Map (Digital Twin Sector Tiles)
          </h3>
          <p className="text-xs text-[#A39D95] mt-0.5">
            Physical evidence tiles pinned across volume sectors. Click any tile to inspect byte offsets.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#171412] p-1 rounded border border-[#3A332F] text-xs font-mono">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded transition ${
              filterType === 'all' ? 'bg-[#D8C39A] text-[#14110F] font-bold' : 'text-[#A39D95] hover:text-[#F2EFE9]'
            }`}
          >
            All ({blockData.length})
          </button>
          <button
            onClick={() => setFilterType('recovered')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition ${
              filterType === 'recovered' ? 'bg-[#4C7A5E] text-[#F2EFE9] font-bold' : 'text-[#4C7A5E] hover:bg-[#25201D]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#4C7A5E]"></span>
            Recovered
          </button>
          <button
            onClick={() => setFilterType('recognized')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition ${
              filterType === 'recognized' ? 'bg-[#D8C39A] text-[#14110F] font-bold' : 'text-[#D8C39A] hover:bg-[#25201D]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#D8C39A]"></span>
            Recognized
          </button>
          <button
            onClick={() => setFilterType('damaged')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition ${
              filterType === 'damaged' ? 'bg-[#B33A2E] text-[#F2EFE9] font-bold' : 'text-[#B33A2E] hover:bg-[#25201D]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#B33A2E]"></span>
            Damaged
          </button>
        </div>
      </div>

      {/* Grid of Pinned Evidence Tiles & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Corkboard Tile Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-lg corkboard-surface border-2 border-[#2F2926] overflow-x-auto max-w-full">
            <div className="grid grid-cols-12 sm:grid-cols-16 gap-1.5 min-w-[320px]">
              {filteredBlocks.map((block) => {
                const isSelected = selectedBlock?.id === block.id;
                return (
                  <button
                    key={block.id}
                    onClick={() => {
                      setSelectedBlock(block);
                      if (onSelectBlock) onSelectBlock(block);
                    }}
                    title={`Sector ${block.offset} | ${block.label}`}
                    className={`h-7 rounded-[2px] border text-[9px] font-mono flex items-center justify-center transition-all cursor-pointer ${getTileClasses(block.type)} ${
                      isSelected ? 'ring-2 ring-[#F2EFE9] scale-110 z-10 shadow-lg' : 'opacity-90 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    #{block.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#A39D95] px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] bg-[#D8C39A] border border-[#B39F73]"></span> Recognized Data
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] bg-[#4C7A5E]"></span> Recovered Fragment
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] bg-[#B33A2E]"></span> Damaged / Parity Bad
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] bg-[#1C1816] border border-[#2F2926]"></span> Unallocated / Free
            </span>
          </div>
        </div>

        {/* Right 1 Col: Pinned Sector Card Inspector */}
        <div className="kraft-card p-5 rounded relative shadow-md flex flex-col justify-between border border-[#B39F73]">
          <div className="evidence-pin evidence-pin-top-center"></div>

          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#B39F73]">
              <span className="text-[10px] font-mono uppercase font-bold text-[#B33A2E]">SECTOR CARD</span>
              <span className="text-[11px] font-mono font-bold text-[#14110F] bg-[#E8DCC2] px-2 py-0.5 rounded">
                Tile #{selectedBlock?.id || 1}
              </span>
            </div>

            {selectedBlock ? (
              <div className="space-y-3 mt-3 text-xs text-[#14110F]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#4A5560]">Byte Offset Range</span>
                  <p className="font-mono text-[#14110F] text-xs font-bold bg-[#E8DCC2] p-2 rounded border border-[#B39F73] mt-0.5">
                    {selectedBlock.offset}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#E8DCC2] p-2 rounded border border-[#B39F73]">
                    <span className="text-[10px] font-mono uppercase text-[#4A5560]">Block Size</span>
                    <p className="font-mono text-[#14110F] font-bold mt-0.5">{selectedBlock.size}</p>
                  </div>
                  <div className="bg-[#E8DCC2] p-2 rounded border border-[#B39F73]">
                    <span className="text-[10px] font-mono uppercase text-[#4A5560]">Confidence</span>
                    <p className="font-mono text-[#4C7A5E] font-bold mt-0.5">{selectedBlock.confidence}%</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#4A5560]">Carved Label</span>
                  <p className="font-document text-sm font-bold text-[#14110F] mt-0.5">{selectedBlock.label}</p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#4A5560]">Linked Case Artifact</span>
                  <p className="font-mono text-[11px] text-[#B33A2E] font-semibold mt-0.5">{selectedBlock.artifact}</p>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#4A5560]">Parity State</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        selectedBlock.type === 'recovered' || selectedBlock.type === 'recognized'
                          ? 'bg-[#4C7A5E]/20 text-[#4C7A5E]'
                          : selectedBlock.type === 'damaged'
                          ? 'bg-[#B33A2E]/20 text-[#B33A2E]'
                          : 'bg-[#25201D] text-[#4A5560]'
                      }`}
                    >
                      {selectedBlock.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#4A5560] py-6 text-center">Select an evidence tile to inspect.</p>
            )}
          </div>

          <div className="pt-3 border-t border-[#B39F73] text-[10px] font-mono text-[#4A5560]">
            Digital Twin Physical Cluster Stream
          </div>
        </div>
      </div>
    </div>
  );
}
