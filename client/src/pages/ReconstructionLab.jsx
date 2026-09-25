import React, { useState } from 'react';
import FragmentGraph from '../components/FragmentGraph';
import StorageMap from '../components/StorageMap';
import { Tag, Pin, Network, Layers, Sparkles } from 'lucide-react';

export default function ReconstructionLab({ scanResult }) {
  const [activeView, setActiveView] = useState('both');

  return (
    <div className="space-y-8">
      {/* Evidence Board Header */}
      <div className="ink-card rounded-lg p-6 sm:p-8 relative border border-[#2F2926]">
        <div className="evidence-pin evidence-pin-top-left"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rubber-stamp text-xs">
                RECONSTRUCTION LAB
              </span>
              <span className="text-xs font-mono text-[#D8C39A]">
                RED STRING TOPOLOGY & DIGITAL TWIN
              </span>
            </div>
            <h1 className="font-document text-2xl font-bold text-[#F2EFE9] mt-2">
              Fragment Relationship Lab & Sector Topology
            </h1>
            <p className="text-xs text-[#A39D95] mt-1 max-w-2xl">
              Inspect unallocated disk sector chains, red string affinity thresholds, and the digital twin storage grid.
            </p>
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-1 bg-[#171412] p-1 rounded border border-[#3A332F] text-xs font-mono">
            <button
              onClick={() => setActiveView('both')}
              className={`px-3 py-1.5 rounded transition ${
                activeView === 'both' ? 'bg-[#D8C39A] text-[#14110F] font-bold' : 'text-[#A39D95] hover:text-[#F2EFE9]'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveView('graph')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded transition ${
                activeView === 'graph' ? 'bg-[#D8C39A] text-[#14110F] font-bold' : 'text-[#A39D95] hover:text-[#F2EFE9]'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              Red String Graph
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded transition ${
                activeView === 'map' ? 'bg-[#D8C39A] text-[#14110F] font-bold' : 'text-[#A39D95] hover:text-[#F2EFE9]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Storage Tiles
            </button>
          </div>
        </div>
      </div>

      {/* Visualizers */}
      <div className="space-y-8">
        {(activeView === 'both' || activeView === 'graph') && (
          <FragmentGraph />
        )}

        {(activeView === 'both' || activeView === 'map') && (
          <StorageMap />
        )}
      </div>
    </div>
  );
}
