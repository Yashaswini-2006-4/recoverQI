import React, { useState } from 'react';
import FragmentGraph from '../components/FragmentGraph';
import StorageMap from '../components/StorageMap';
import { Cpu, Network, Layers, Sparkles, Sliders, Play, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ReconstructionLab({ scanResult }) {
  const [activeView, setActiveView] = useState('both');
  const [selectedClusterBlock, setSelectedClusterBlock] = useState(null);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold uppercase">
              <Sparkles className="w-4 h-4 text-sky-400" />
              Advanced Neural Forensic Lab
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Reconstruction Lab & Fragment Topology
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Inspect unallocated disk sector graphs, greedy carving paths, cluster affinities, and memory digital twin maps.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveView('both')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeView === 'both' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveView('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeView === 'graph' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              Fragment Graph
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeView === 'map' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Storage Digital Twin
            </button>
          </div>
        </div>
      </div>

      {/* Main Visualizers */}
      <div className="space-y-8">
        {(activeView === 'both' || activeView === 'graph') && (
          <FragmentGraph />
        )}

        {(activeView === 'both' || activeView === 'map') && (
          <StorageMap onSelectBlock={(block) => setSelectedClusterBlock(block)} />
        )}
      </div>
    </div>
  );
}
