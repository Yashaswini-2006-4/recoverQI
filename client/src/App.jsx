import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ScanResults from './pages/ScanResults';
import Diagnostics from './components/Diagnostics';
import { mockScanData } from './data/mockData';

export default function App() {
  const [scanResult, setScanResult] = useState(mockScanData);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
        {/* Top Navbar */}
        <Navbar />

        {/* Routed View Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {/* 1. Upload & Main Dashboard View (/) */}
            <Route
              path="/"
              element={<Dashboard scanResult={scanResult} setScanResult={setScanResult} />}
            />

            {/* 2. Detailed Results Page (/results/:scanId) */}
            <Route
              path="/results/:scanId"
              element={<ScanResults />}
            />

            {/* 3. Hardware & Engine Diagnostics (/diagnostics) */}
            <Route
              path="/diagnostics"
              element={<Diagnostics />}
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026 RecoverIQ Project • Built with React 19, Vite, & Tailwind CSS</p>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Branch: <span className="text-sky-400 font-mono">member-2</span></span>
              <span>Mock API: <span className="text-emerald-400">Connected</span></span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
