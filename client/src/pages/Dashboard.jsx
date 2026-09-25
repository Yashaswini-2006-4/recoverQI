import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import ScanSummary from '../components/ScanSummary';
import ArtifactTable from '../components/ArtifactTable';
import FragmentGraph from '../components/FragmentGraph';
import StorageMap from '../components/StorageMap';
import RecentScans from '../components/RecentScans';
import { mockScanData } from '../data/mockData';
import { Tag, Pin, Network, Layers, FileText, ExternalLink, HardDrive, ShieldCheck } from 'lucide-react';

export default function Dashboard({ scanResult, setScanResult }) {
  const [isScanning, setIsScanning] = useState(false);
  const [activeBoardView, setActiveBoardView] = useState('full');
  const navigate = useNavigate();

  const handleScanComplete = (apiData) => {
    setScanResult(apiData);
  };

  const handleSelectRecent = (scan) => {
    navigate(`/results/${scan.id}`);
  };

  return (
    <div className="space-y-8 max-w-full">
      {/* Evidence Board Top Banner */}
      <div className="ink-card rounded-lg p-6 relative border border-[#2F2926]">
        <div className="evidence-pin evidence-pin-top-left"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rubber-stamp text-xs">
                OFFICIAL CASE EVIDENCE BOARD
              </span>
              <span className="text-xs font-mono text-[#D8C39A]">
                BRANCH: member-2
              </span>
            </div>
            <h1 className="font-document text-2xl font-bold text-[#F2EFE9] mt-2 tracking-tight">
              Digital Forensics & Reconstruction Workspace
            </h1>
            <p className="text-xs text-[#A39D95] mt-1 max-w-2xl">
              Pin raw volume dumps, analyze magic byte signatures, inspect red string fragment topologies, and verify cryptographic evidence ledgers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#D8C39A] bg-[#171412] px-3.5 py-2 rounded border border-[#3A332F]">
            <Pin className="w-3.5 h-3.5 text-[#B33A2E]" />
            <span>Active Case: #{scanResult.scanId}</span>
          </div>
        </div>
      </div>

      {/* 1. Evidence Vault: Drop Zone */}
      <FileUploader
        onScanComplete={handleScanComplete}
        isScanning={isScanning}
        setIsScanning={setIsScanning}
      />

      {/* 2. Scan Summary: Pinned Index Cards */}
      <ScanSummary
        scanData={scanResult}
        onReset={() => setScanResult(mockScanData)}
      />

      {/* View Filter on the Evidence Board */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2F2926] pb-3">
        <h3 className="font-document text-lg font-bold text-[#F2EFE9] flex items-center gap-2">
          <Pin className="w-4 h-4 text-[#B33A2E]" />
          Evidence Board Views
        </h3>

        <div className="flex items-center gap-1 bg-[#171412] p-1 rounded border border-[#3A332F] text-xs font-mono">
          <button
            onClick={() => setActiveBoardView('full')}
            className={`px-3 py-1.5 rounded transition ${
              activeBoardView === 'full' ? 'bg-[#D8C39A] text-[#14110F] font-bold' : 'text-[#A39D95] hover:text-[#F2EFE9]'
            }`}
          >
            All Evidence
          </button>
          <button
            onClick={() => setActiveBoardView('ledger')}
            className={`px-3 py-1.5 rounded transition ${
              activeBoardView === 'ledger' ? 'bg-[#D8C39A] text-[#14110F] font-bold' : 'text-[#A39D95] hover:text-[#F2EFE9]'
            }`}
          >
            Case Log Table
          </button>
          <button
            onClick={() => setActiveBoardView('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
              activeBoardView === 'graph' ? 'bg-[#D8C39A] text-[#14110F] font-bold' : 'text-[#A39D95] hover:text-[#F2EFE9]'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Red String Graph
          </button>
          <button
            onClick={() => setActiveBoardView('storage')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
              activeBoardView === 'storage' ? 'bg-[#D8C39A] text-[#14110F] font-bold' : 'text-[#A39D95] hover:text-[#F2EFE9]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Storage Map
          </button>
        </div>
      </div>

      {/* 3. Artifacts Table: Evidence Inventory */}
      {(activeBoardView === 'full' || activeBoardView === 'ledger') && (
        <ArtifactTable artifacts={scanResult?.artifacts || []} />
      )}

      {/* 4. Fragment Relationship Graph: Red String on Corkboard */}
      {(activeBoardView === 'full' || activeBoardView === 'graph') && (
        <FragmentGraph />
      )}

      {/* 5. Storage Map Digital Twin: Evidence Tiles */}
      {(activeBoardView === 'full' || activeBoardView === 'storage') && (
        <StorageMap />
      )}

      {/* 6. Recent Case Dockets */}
      <RecentScans onSelectScan={handleSelectRecent} />
    </div>
  );
}
