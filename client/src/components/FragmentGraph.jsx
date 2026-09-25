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
import { Network, Activity, Cpu, Sparkles, FileCode, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

const initialFragmentData = {
  'F-01': {
    id: 'F-01',
    label: 'Fragment F-01: Header Signature',
    offset: '0x00020000',
    size: '64 KB',
    entropy: 7.42,
    magicBytes: '50 4B 03 04 (ZIP / OOXML)',
    file: 'financial_ledger.xlsx',
    confidence: 99.4,
    status: 'Verified Header'
  },
  'F-02': {
    id: 'F-02',
    label: 'Fragment F-02: Sheet XML Stream A',
    offset: '0x00030000',
    size: '128 KB',
    entropy: 7.85,
    magicBytes: '3C 3F 78 6D 6C (XML Tag)',
    file: 'financial_ledger.xlsx',
    confidence: 96.2,
    status: 'Consecutive Cluster'
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
    status: 'Heuristic Match'
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
    status: 'Verified Trailer'
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
    status: 'Uncertain Candidate'
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
    status: 'Distinct Stream'
  }
};

const initialNodes = [
  {
    id: 'F-01',
    data: { label: 'F-01 [Header]' },
    position: { x: 50, y: 80 },
    style: {
      background: '#0f172a',
      color: '#38bdf8',
      border: '2px solid #38bdf8',
      borderRadius: '12px',
      padding: '10px 16px',
      fontWeight: 'bold',
      fontSize: '12px',
      boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)'
    }
  },
  {
    id: 'F-02',
    data: { label: 'F-02 [XML Body A]' },
    position: { x: 260, y: 80 },
    style: {
      background: '#0f172a',
      color: '#34d399',
      border: '2px solid #34d399',
      borderRadius: '12px',
      padding: '10px 16px',
      fontWeight: 'bold',
      fontSize: '12px',
      boxShadow: '0 0 15px rgba(52, 211, 153, 0.3)'
    }
  },
  {
    id: 'F-03',
    data: { label: 'F-03 [Strings Table]' },
    position: { x: 470, y: 80 },
    style: {
      background: '#0f172a',
      color: '#818cf8',
      border: '2px solid #818cf8',
      borderRadius: '12px',
      padding: '10px 16px',
      fontWeight: 'bold',
      fontSize: '12px',
      boxShadow: '0 0 15px rgba(129, 140, 248, 0.3)'
    }
  },
  {
    id: 'F-04',
    data: { label: 'F-04 [EOCD Trailer]' },
    position: { x: 680, y: 80 },
    style: {
      background: '#0f172a',
      color: '#34d399',
      border: '2px solid #34d399',
      borderRadius: '12px',
      padding: '10px 16px',
      fontWeight: 'bold',
      fontSize: '12px',
      boxShadow: '0 0 15px rgba(52, 211, 153, 0.3)'
    }
  },
  {
    id: 'F-05',
    data: { label: 'F-05 [Orphan Block]' },
    position: { x: 260, y: 240 },
    style: {
      background: '#1e1b4b',
      color: '#f59e0b',
      border: '2px dashed #f59e0b',
      borderRadius: '12px',
      padding: '10px 16px',
      fontWeight: 'bold',
      fontSize: '12px'
    }
  },
  {
    id: 'F-06',
    data: { label: 'F-06 [SQLite Root]' },
    position: { x: 520, y: 240 },
    style: {
      background: '#0f172a',
      color: '#c084fc',
      border: '2px solid #c084fc',
      borderRadius: '12px',
      padding: '10px 16px',
      fontWeight: 'bold',
      fontSize: '12px'
    }
  }
];

const initialEdges = [
  {
    id: 'e1-2',
    source: 'F-01',
    target: 'F-02',
    label: 'strength: 0.96',
    animated: true,
    style: { stroke: '#34d399', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#34d399' },
  },
  {
    id: 'e2-3',
    source: 'F-02',
    target: 'F-03',
    label: 'strength: 0.91',
    animated: true,
    style: { stroke: '#38bdf8', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' },
  },
  {
    id: 'e3-4',
    source: 'F-03',
    target: 'F-04',
    label: 'strength: 0.88',
    animated: true,
    style: { stroke: '#818cf8', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
  },
  {
    id: 'e2-5',
    source: 'F-02',
    target: 'F-05',
    label: 'strength: 0.42 (uncertain)',
    style: { stroke: '#64748b', strokeDasharray: '5,5', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
  },
  {
    id: 'e5-6',
    source: 'F-05',
    target: 'F-06',
    label: 'strength: 0.28 (unrelated)',
    style: { stroke: '#475569', strokeDasharray: '4,4', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' },
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
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-sky-400" />
            Fragment Relationship & Chain Graph
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Interactive neural graph linking unallocated sector fragments based on entropy and header affinity.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Greedy Graph Carve: 6 Nodes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: React Flow Canvas */}
        <div className="lg:col-span-2 h-[420px] rounded-2xl bg-slate-950/90 border border-slate-800 overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
          >
            <Background color="#1e293b" gap={16} />
            <Controls className="bg-slate-900 border border-slate-700 text-white fill-white rounded-xl overflow-hidden" />
            <MiniMap
              nodeColor={(node) => {
                if (node.id === 'F-05') return '#f59e0b';
                return '#38bdf8';
              }}
              className="bg-slate-900 border border-slate-800 rounded-xl"
            />
          </ReactFlow>

          {/* Graph Legend Overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-mono space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-emerald-400"></span>
              <span>High Affinity (Strength &gt; 0.85)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 border-b border-dashed border-slate-400"></span>
              <span>Uncertain / Cross-cluster (&lt; 0.50)</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Fragment Inspector */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 bg-slate-900/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-sky-400">FRAGMENT INSPECTOR</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                {selectedFragment.id}
              </span>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400">Fragment Identifier</span>
                <p className="font-semibold text-white mt-0.5">{selectedFragment.label}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Sector Offset</span>
                  <p className="font-mono text-sky-400 font-bold mt-0.5">{selectedFragment.offset}</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Block Size</span>
                  <p className="font-mono text-slate-200 font-bold mt-0.5">{selectedFragment.size}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Shannon Entropy</span>
                  <p className="font-mono text-indigo-300 font-bold mt-0.5">{selectedFragment.entropy} / 8.0</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Chain Affinity</span>
                  <p className="font-mono text-emerald-400 font-bold mt-0.5">{selectedFragment.confidence}%</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400">Detected Magic Signature</span>
                <p className="font-mono text-[11px] text-amber-300 bg-slate-950 p-2 rounded-lg border border-slate-800 break-all mt-0.5">
                  {selectedFragment.magicBytes}
                </p>
              </div>

              <div>
                <span className="text-slate-400">Reconstructed File Association</span>
                <p className="font-mono text-slate-200 mt-0.5 font-semibold">{selectedFragment.file}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Neural Match Engine v4</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
