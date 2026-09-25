import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Pin, Sparkles, Tag, Check, AlertTriangle, Hash, FileCode } from 'lucide-react';

const initialFragmentData = {
  'F-01': {
    id: 'F-01',
    label: 'Fragment F-01: Header Signature',
    offset: '0x00020000',
    size: '64 KB',
    entropy: 7.42,
    magicBytes: '50 4B 03 04 (ZIP / OOXML Header)',
    file: 'financial_ledger.xlsx',
    confidence: 99.4,
    status: 'Verified Header Pin'
  },
  'F-02': {
    id: 'F-02',
    label: 'Fragment F-02: Sheet XML Stream A',
    offset: '0x00030000',
    size: '128 KB',
    entropy: 7.85,
    magicBytes: '3C 3F 78 6D 6C (XML Descriptor)',
    file: 'financial_ledger.xlsx',
    confidence: 96.2,
    status: 'Taut String Link'
  },
  'F-03': {
    id: 'F-03',
    label: 'Fragment F-03: Shared Strings Table',
    offset: '0x00050000',
    size: '256 KB',
    entropy: 7.71,
    magicBytes: '73 73 74 20 (SST Node)',
    file: 'financial_ledger.xlsx',
    confidence: 91.8,
    status: 'Heuristic String Match'
  },
  'F-04': {
    id: 'F-04',
    label: 'Fragment F-04: End Central Directory',
    offset: '0x00090000',
    size: '32 KB',
    entropy: 6.20,
    magicBytes: '50 4B 05 06 (EOCD Record)',
    file: 'financial_ledger.xlsx',
    confidence: 98.0,
    status: 'Verified Trailer Pin'
  },
  'F-05': {
    id: 'F-05',
    label: 'Fragment F-05: Orphaned Inode Block',
    offset: '0x000C0000',
    size: '64 KB',
    entropy: 5.12,
    magicBytes: '00 00 00 00 (Sparse Zeroes)',
    file: 'corrupted_inode.dat',
    confidence: 42.0,
    status: 'Slack Red String'
  },
  'F-06': {
    id: 'F-06',
    label: 'Fragment F-06: SQLite B-Tree Root',
    offset: '0x00100000',
    size: '512 KB',
    entropy: 7.94,
    magicBytes: '53 51 4C 69 74 65 (SQLite format 3)',
    file: 'contracts.db',
    confidence: 98.5,
    status: 'Separate Evidence Chain'
  }
};

// Pinned photo card nodes on the corkboard
const initialNodes = [
  {
    id: 'F-01',
    data: { label: '📌 F-01 [Header Card]' },
    position: { x: 40, y: 70 },
    style: {
      background: '#D8C39A',
      color: '#14110F',
      border: '1px solid #B39F73',
      borderRadius: '4px',
      padding: '8px 14px',
      fontWeight: 'bold',
      fontFamily: 'Fraunces, serif',
      fontSize: '12px',
      boxShadow: '2px 4px 10px rgba(0, 0, 0, 0.5)'
    }
  },
  {
    id: 'F-02',
    data: { label: '📌 F-02 [XML Body A]' },
    position: { x: 260, y: 70 },
    style: {
      background: '#D8C39A',
      color: '#14110F',
      border: '1px solid #B39F73',
      borderRadius: '4px',
      padding: '8px 14px',
      fontWeight: 'bold',
      fontFamily: 'Fraunces, serif',
      fontSize: '12px',
      boxShadow: '2px 4px 10px rgba(0, 0, 0, 0.5)'
    }
  },
  {
    id: 'F-03',
    data: { label: '📌 F-03 [Strings Node]' },
    position: { x: 480, y: 70 },
    style: {
      background: '#D8C39A',
      color: '#14110F',
      border: '1px solid #B39F73',
      borderRadius: '4px',
      padding: '8px 14px',
      fontWeight: 'bold',
      fontFamily: 'Fraunces, serif',
      fontSize: '12px',
      boxShadow: '2px 4px 10px rgba(0, 0, 0, 0.5)'
    }
  },
  {
    id: 'F-04',
    data: { label: '📌 F-04 [EOCD Trailer]' },
    position: { x: 700, y: 70 },
    style: {
      background: '#D8C39A',
      color: '#14110F',
      border: '1px solid #B39F73',
      borderRadius: '4px',
      padding: '8px 14px',
      fontWeight: 'bold',
      fontFamily: 'Fraunces, serif',
      fontSize: '12px',
      boxShadow: '2px 4px 10px rgba(0, 0, 0, 0.5)'
    }
  },
  {
    id: 'F-05',
    data: { label: '📌 F-05 [Orphan Block]' },
    position: { x: 260, y: 230 },
    style: {
      background: '#25201D',
      color: '#C68A2E',
      border: '1px dashed #C68A2E',
      borderRadius: '4px',
      padding: '8px 14px',
      fontWeight: 'bold',
      fontFamily: 'Fraunces, serif',
      fontSize: '12px'
    }
  },
  {
    id: 'F-06',
    data: { label: '📌 F-06 [SQLite Root]' },
    position: { x: 520, y: 230 },
    style: {
      background: '#D8C39A',
      color: '#14110F',
      border: '1px solid #B39F73',
      borderRadius: '4px',
      padding: '8px 14px',
      fontWeight: 'bold',
      fontFamily: 'Fraunces, serif',
      fontSize: '12px',
      boxShadow: '2px 4px 10px rgba(0, 0, 0, 0.5)'
    }
  }
];

// Red string edges connecting clues
const initialEdges = [
  {
    id: 'e1-2',
    source: 'F-01',
    target: 'F-02',
    label: 'red string (affinity 0.96)',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#B33A2E', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#B33A2E' },
  },
  {
    id: 'e2-3',
    source: 'F-02',
    target: 'F-03',
    label: 'red string (affinity 0.91)',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#B33A2E', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#B33A2E' },
  },
  {
    id: 'e3-4',
    source: 'F-03',
    target: 'F-04',
    label: 'red string (affinity 0.88)',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#B33A2E', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#B33A2E' },
  },
  {
    id: 'e2-5',
    source: 'F-02',
    target: 'F-05',
    label: 'slack string (0.42)',
    type: 'smoothstep',
    style: { stroke: '#4A5560', strokeDasharray: '6,6', strokeWidth: 1.5, opacity: 0.6 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4A5560' },
  },
  {
    id: 'e5-6',
    source: 'F-05',
    target: 'F-06',
    label: 'slack string (0.28)',
    type: 'smoothstep',
    style: { stroke: '#4A5560', strokeDasharray: '4,4', strokeWidth: 1.5, opacity: 0.4 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4A5560' },
  }
];

export default function FragmentGraph() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedFragment, setSelectedFragment] = useState(initialFragmentData['F-01']);

  const onNodeClick = useCallback((event, node) => {
    if (initialFragmentData[node.id]) {
      setSelectedFragment(initialFragmentData[node.id]);
    }
  }, []);

  return (
    <div className="ink-card rounded-lg p-6 sm:p-8 border border-[#2F2926] relative space-y-6">
      {/* Evidence Pushpin */}
      <div className="evidence-pin evidence-pin-top-left"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2F2926] pl-3">
        <div>
          <h3 className="font-document text-xl font-bold text-[#F2EFE9] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#B33A2E]" />
            Fragment Topology & Red String Connection Graph
          </h3>
          <p className="text-xs text-[#A39D95] mt-0.5">
            Detective corkboard visualization: red string links fragmented clues based on cross-cluster entropy.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#D8C39A] bg-[#171412] px-3 py-1.5 rounded border border-[#3A332F]">
          <span className="w-2 h-2 rounded-full bg-[#B33A2E]"></span>
          <span>Red String Tension: Taut (0.96)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Corkboard Surface Canvas */}
        <div className="lg:col-span-2 h-[420px] rounded-lg corkboard-surface border-2 border-[#2F2926] overflow-hidden relative shadow-inner">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
          >
            <Background color="#2a2420" gap={20} size={1} />
            <Controls className="bg-[#171412] border border-[#3A332F] text-[#F2EFE9] fill-[#F2EFE9] rounded" />
            <MiniMap
              nodeColor={(node) => {
                if (node.id === 'F-05') return '#C68A2E';
                return '#D8C39A';
              }}
              className="bg-[#171412] border border-[#3A332F] rounded"
            />
          </ReactFlow>

          {/* String Legend */}
          <div className="absolute bottom-3 left-3 bg-[#171412]/95 p-2 rounded border border-[#2F2926] text-[10px] font-mono text-[#A39D95] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#B33A2E]"></span>
              <span>Taut Red String (Strong Affinity &gt; 0.85)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 border-b border-dashed border-[#4A5560]"></span>
              <span>Slack / Dashed String (Uncertain &lt; 0.50)</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Pinned Clue Inspector */}
        <div className="kraft-card p-5 rounded relative shadow-md flex flex-col justify-between border border-[#B39F73]">
          <div className="evidence-pin evidence-pin-top-center"></div>

          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#B39F73]">
              <span className="text-[10px] font-mono uppercase font-bold text-[#B33A2E]">CLUE INSPECTOR</span>
              <span className="text-[11px] font-mono font-bold text-[#14110F] bg-[#E8DCC2] px-2 py-0.5 rounded">
                {selectedFragment.id}
              </span>
            </div>

            <div className="mt-3 space-y-3 text-xs text-[#14110F]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#4A5560]">Fragment Label</span>
                <p className="font-document font-bold text-sm text-[#14110F] mt-0.5">{selectedFragment.label}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#E8DCC2] p-2 rounded border border-[#B39F73]">
                  <span className="text-[10px] font-mono uppercase text-[#4A5560]">Sector Offset</span>
                  <p className="font-mono text-[#B33A2E] font-bold mt-0.5">{selectedFragment.offset}</p>
                </div>
                <div className="bg-[#E8DCC2] p-2 rounded border border-[#B39F73]">
                  <span className="text-[10px] font-mono uppercase text-[#4A5560]">Block Size</span>
                  <p className="font-mono text-[#14110F] font-bold mt-0.5">{selectedFragment.size}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#E8DCC2] p-2 rounded border border-[#B39F73]">
                  <span className="text-[10px] font-mono uppercase text-[#4A5560]">Entropy Index</span>
                  <p className="font-mono text-[#14110F] font-bold mt-0.5">{selectedFragment.entropy} / 8.0</p>
                </div>
                <div className="bg-[#E8DCC2] p-2 rounded border border-[#B39F73]">
                  <span className="text-[10px] font-mono uppercase text-[#4A5560]">Link Confidence</span>
                  <p className="font-mono text-[#4C7A5E] font-bold mt-0.5">{selectedFragment.confidence}%</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#4A5560]">Magic Bytes Signature</span>
                <p className="font-mono text-[11px] text-[#14110F] bg-[#E8DCC2] p-2 rounded border border-[#B39F73] break-all mt-0.5 font-semibold">
                  {selectedFragment.magicBytes}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#4A5560]">Associated Reconstructed File</span>
                <p className="font-document text-xs font-bold text-[#14110F] mt-0.5">{selectedFragment.file}</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#B39F73] text-[10px] font-mono text-[#4A5560] flex items-center justify-between">
            <span>Stitch Topology: Solved</span>
            <span className="text-[#4C7A5E] font-bold">100% Chain Parity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
