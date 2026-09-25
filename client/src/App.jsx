import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FileUploader from './components/FileUploader';
import ScanSummary from './components/ScanSummary';
import RecentScans from './components/RecentScans';
import Diagnostics from './components/Diagnostics';
import RecoveryStats from './components/RecoveryStats';
import { mockScanData } from './data/mockData';
import { Sparkles, GitBranch } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(mockScanData);

  const handleScanComplete = (scanMeta) => {
    setScanResult({
      ...mockScanData,
      targetDrive: `${scanMeta.fileName} (${scanMeta.fileSize})`,
      timestamp: new Date().toISOString()
    });
  };

  const handleSelectRecentScan = (scan) => {
    setScanResult({
      ...mockScanData,
      scanId: scan.id,
      targetDrive: scan.name,
      summary: {
        ...mockScanData.summary,
        recoveredSize: scan.size,
      }
    });
    setActiveTab('scan');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner for Member-2 / Status */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-sky-900/30 border border-indigo-500/20 p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 mt-1 sm:mt-0">
                <Sparkles className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  RecoverIQ UI Module Active
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    BRANCH: member-2
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-speed heuristic raw sector carving & disk image recovery engine.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
              <GitBranch className="w-3.5 h-3.5 text-sky-400" />
              <span>origin/member-2</span>
            </div>
          </div>
        </div>

        {/* Global Key Metrics Overview */}
        <RecoveryStats />

        {/* Tab 1: Scan & Recovery Flow with FileUploader & ScanSummary visible */}
        {activeTab === 'scan' && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. File Uploader Box */}
            <FileUploader
              onScanComplete={handleScanComplete}
              isScanning={isScanning}
              setIsScanning={setIsScanning}
            />

            {/* 2. Scan Summary Card with mock data */}
            <ScanSummary
              scanData={scanResult}
              onReset={() => setScanResult(mockScanData)}
            />

            {/* 3. Recent Sessions */}
            <RecentScans onSelectScan={handleSelectRecentScan} />
          </div>
        )}

        {/* Tab 2: Scan History */}
        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <RecentScans onSelectScan={handleSelectRecentScan} />
          </div>
        )}

        {/* Tab 3: Diagnostics */}
        {activeTab === 'diagnostics' && (
          <div className="animate-fade-in">
            <Diagnostics />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 RecoverIQ Project • Built with React 19, Vite, & Tailwind CSS</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Branch: <span className="text-sky-400 font-mono">member-2</span></span>
            <span>Status: <span className="text-emerald-400">Synchronized</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
