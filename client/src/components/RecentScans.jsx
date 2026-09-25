import React from 'react';
import { sampleRecentScans } from '../data/mockData';
import { History, CheckCircle2, AlertTriangle, ArrowRight, HardDrive, Calendar } from 'lucide-react';

export default function RecentScans({ onSelectScan }) {
  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-sky-400" />
            Sample Historical Sessions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
           Illustrative demo records for previously completed recovery scans.
            These are sample sessions, not live scan history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleRecentScans.map((scan) => (
          <div
            key={scan.id}
            onClick={() => onSelectScan && onSelectScan(scan)}
            className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-indigo-300 font-semibold">{scan.id}</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {scan.date}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-200 group-hover:text-sky-400 transition-colors">
              {scan.name}
            </h3>

            <div className="grid grid-cols-2 gap-2 my-3 text-xs">
              <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                <span className="text-slate-500">Files:</span>
                <p className="font-semibold text-slate-300">{scan.filesFound}</p>
              </div>
              <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                <span className="text-slate-500">Recovered:</span>
                <p className="font-semibold text-emerald-400">{scan.size}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {scan.health} integrity
              </span>
              <span className="text-sky-400 flex items-center gap-1 font-medium group-hover:translate-x-0.5 transition-transform">
                View Ledger <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
