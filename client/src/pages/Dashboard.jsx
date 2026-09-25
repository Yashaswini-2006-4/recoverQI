import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import ScanSummary from '../components/ScanSummary';
import ArtifactTable from '../components/ArtifactTable';
import FragmentGraph from '../components/FragmentGraph';
import StorageMap from '../components/StorageMap';
import RecoveryStats from '../components/RecoveryStats';
import RecentScans from '../components/RecentScans';
import { mockScanData } from '../data/mockData';
import { Sparkles, GitBranch, ExternalLink, Network, Layers, HardDrive } from 'lucide-react';

export default function Dashboard({ scanResult, setScanResult }) {
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const handleScanComplete = (apiData) => {
    setScanResult(apiData);
  };

  const handleSelectRecent = (scan) => {
    navigate(`/results/${scan.id}`);
  };

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-sky-900/30 border border-indigo-500/20 p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 mt-1 sm:mt-0">
              <Sparkles className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                RecoverIQ Forensic Investigation Workspace
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  BRANCH: member-2
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete investigation session: volume ingestion, greedy carving graph, digital twin storage map, & ledger.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <span>origin/member-2</span>
          </div>
        </div>
      </div>

      {/* Global Metric Cards */}
      <RecoveryStats />

      {/* Step 1: File Uploader Box (Wired to mock API) */}
      <FileUploader
        onScanComplete={handleScanComplete}
        isScanning={isScanning}
        setIsScanning={setIsScanning}
      />

      {/* Step 2: Scan Summary Cards (filesDetected, filesRecovered, partialFiles, failedFiles) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-sky-400" />
            Active Scan & Ledger Overview
          </h2>
          <button
            onClick={() => navigate(`/results/${scanResult.scanId}`)}
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
          >
            <span>Open Dedicated Results Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
        <ScanSummary
          scanData={scanResult}
          onReset={() => setScanResult(mockScanData)}
        />
      </div>

      {/* Section Mode Filter */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-200">Investigation Workbench Views</h3>
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Flow (All)
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Artifact Ledger
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'graph' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Fragment Graph
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'map' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Storage Map
          </button>
        </div>
      </div>

      {/* Step 3: Artifacts Table with Previews & Downloads */}
      {(activeTab === 'all' || activeTab === 'table') && (
        <ArtifactTable artifacts={scanResult?.artifacts || []} />
      )}

      {/* Step 4: Fragment Relationship Graph */}
      {(activeTab === 'all' || activeTab === 'graph') && (
        <FragmentGraph />
      )}

      {/* Step 5: Storage Map (Digital Twin) */}
      {(activeTab === 'all' || activeTab === 'map') && (
        <StorageMap />
      )}

      {/* Step 6: Recent Scans History */}
      <RecentScans onSelectScan={handleSelectRecent} />
    </div>
  );
}
