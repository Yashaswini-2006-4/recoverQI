import React from 'react';
import { Cpu, HardDrive, ShieldCheck, Gauge, Zap, CheckCircle } from 'lucide-react';

export default function Diagnostics() {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          Hardware & Engine Diagnostics
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Real-time low-level I/O metrics and carve pipeline health.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">Memory Buffer</span>
              <Gauge className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">1.8 / 16 GB</p>
            <p className="text-xs text-emerald-400 mt-1">Direct I/O zero-copy active</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">ECC Parity Accuracy</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-2">99.98%</p>
            <p className="text-xs text-slate-400 mt-1">Reed-Solomon decoding ready</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">Neural Match Engine</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-sky-300 mt-2">v4.2-Fast</p>
            <p className="text-xs text-slate-400 mt-1">45,000 file magic signatures</p>
          </div>
        </div>

        {/* Simulated Sector Cluster Heatmap */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Cluster Sector Integrity Map (Sample Block #0x4000 - #0x5FFF)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              <span className="inline-block w-2 h-2 rounded bg-emerald-500 mr-1"></span> Healthy &nbsp;
              <span className="inline-block w-2 h-2 rounded bg-sky-500 mr-1"></span> Reconstructed &nbsp;
              <span className="inline-block w-2 h-2 rounded bg-amber-500 mr-1"></span> Parity ECC
            </span>
          </div>
          <div className="grid grid-cols-16 sm:grid-cols-32 gap-1 p-3 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
            {Array.from({ length: 96 }).map((_, i) => {
              const colors = [
                'bg-emerald-500/80',
                'bg-emerald-400',
                'bg-sky-500',
                'bg-sky-400',
                'bg-indigo-500',
                'bg-amber-400',
              ];
              const color = i === 14 || i === 42 || i === 78 ? colors[5] : i % 5 === 0 ? colors[2] : colors[1];
              return (
                <div
                  key={i}
                  title={`Cluster #0x00${(i * 128).toString(16)}`}
                  className={`h-4 rounded-[2px] ${color} opacity-90 hover:opacity-100 hover:scale-125 transition-all cursor-pointer`}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
