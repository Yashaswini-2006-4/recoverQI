// client/src/pages/Dashboard.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import FileUploader from "../components/FileUploader";
import ScanSummary from "../components/ScanSummary";
import ArtifactTable from "../components/ArtifactTable";
import RecoveryStats from "../components/RecoveryStats";
import RecentScans from "../components/RecentScans";

import {
  Sparkles,
  GitBranch,
  ExternalLink,
  FileSearch,
} from "lucide-react";

export default function Dashboard({
  scanResult,
  setScanResult,
}) {
  const [isScanning, setIsScanning] = useState(false);

  // Do not display initial mock data as if it were a real scan.
  const [hasRealScan, setHasRealScan] = useState(false);

  const navigate = useNavigate();

  const activeScan = hasRealScan ? scanResult : null;

  /**
   * Called by FileUploader after the backend returns a successful scan.
   */
  const handleScanComplete = (apiData) => {
    console.log("Dashboard received scan result:", apiData);

    if (!apiData || !apiData.scanId) {
      console.error("Invalid scan response:", apiData);
      return;
    }

    setScanResult(apiData);
    setHasRealScan(true);
  };

  /**
   * Opens a completed scan.
   */
  const handleOpenResults = () => {
    if (!activeScan?.scanId) {
      return;
    }

    navigate(`/results/${activeScan.scanId}`);
  };

  /**
   * Selects a scan from the recent scans list.
   */
  const handleSelectRecent = (scan) => {
    const scanId = scan?.scanId || scan?.id;

    if (scanId) {
      navigate(`/results/${scanId}`);
    }
  };

  /**
   * Clears the current scan from the dashboard.
   */
  const handleReset = () => {
    setScanResult(null);
    setHasRealScan(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-sky-900/30 border border-indigo-500/20 p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 mt-1 sm:mt-0">
              <Sparkles className="w-5 h-5 text-sky-400" />
            </div>

            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2 flex-wrap">
                RecoverIQ Forensic Investigation Workspace

                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  LIVE API
                </span>
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                File signature scanning, recovery analysis, and
                cryptographic integrity verification.
              </p>
            </div>
          </div>

          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800 hover:border-sky-500/40 hover:text-sky-300 transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            RecoverIQ API
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Global Overview Metric Cards */}
      <RecoveryStats />

      {/* File Uploader */}
      <FileUploader
        onScanComplete={handleScanComplete}
        isScanning={isScanning}
        setIsScanning={setIsScanning}
      />

      {/* Active Scan Overview */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              Active Scan Overview
            </h2>

            {activeScan && (
              <p className="text-xs text-slate-400 mt-1">
                Scan ID:{" "}
                <span className="font-mono text-sky-300">
                  {activeScan.scanId}
                </span>
              </p>
            )}
          </div>

          {activeScan?.scanId && (
            <button
              type="button"
              onClick={handleOpenResults}
              className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
            >
              <span>Open Dedicated Results Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {activeScan ? (
          <ScanSummary
            scanData={activeScan}
            onReset={handleReset}
          />
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <FileSearch className="w-6 h-6 text-sky-400" />
            </div>

            <h3 className="text-sm font-semibold text-white">
              No scan results yet
            </h3>

            <p className="max-w-lg mx-auto mt-2 text-sm text-slate-400">
              Select a file and click{" "}
              <span className="text-sky-300">
                Submit to API &amp; Start Scan
              </span>
              . The actual results returned by the RecoverIQ backend
              will appear here.
            </p>
          </div>
        )}
      </section>

      {/* Recovered Artifacts */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            Recovered Artifacts
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            {activeScan
              ? `${activeScan.artifacts?.length || 0} recovered candidates returned by the backend.`
              : "Recovered files will appear here after scanning."}
          </p>
        </div>

        <ArtifactTable
          artifacts={activeScan?.artifacts || []}
        />
      </section>

      {/* Recent Scans */}
      <RecentScans
        onSelectScan={handleSelectRecent}
      />
    </div>
  );
}