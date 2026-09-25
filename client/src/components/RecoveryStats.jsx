import React from 'react';
import { HardDrive, CheckCircle2, ShieldAlert, Zap, TrendingUp } from 'lucide-react';

export default function RecoveryStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Scanned</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <HardDrive className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-white mt-2">1.48 TB</p>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-emerald-400" /> Across 12 volume sessions
        </p>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Carved Objects</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-emerald-400 mt-2">98.4%</p>
        <p className="text-xs text-slate-400 mt-1">Average success recovery rate</p>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Restored Data</span>
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-sky-300 mt-2">108.2 GB</p>
        <p className="text-xs text-slate-400 mt-1">Zero bit rot detected</p>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Grade</span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-purple-300 mt-2">NIST-800-88</p>
        <p className="text-xs text-slate-400 mt-1">Forensic read-only isolation</p>
      </div>
    </div>
  );
}
