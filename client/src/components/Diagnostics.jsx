import React from 'react';
import { Cpu, Tag, Pin, ShieldCheck, Gauge, Zap } from 'lucide-react';

export default function Diagnostics() {
  return (
    <div className="space-y-6">
      <div className="ink-card rounded-lg p-6 sm:p-8 border border-[#2F2926] relative">
        <div className="evidence-pin evidence-pin-top-left"></div>

        <div className="pl-3">
          <div className="flex items-center gap-2">
            <span className="rubber-stamp text-xs">
              INTEGRITY CENTER
            </span>
            <span className="text-xs font-mono text-[#D8C39A]">
              HARDWARE & ECC DIAGNOSTICS
            </span>
          </div>
          <h2 className="font-document text-2xl font-bold text-[#F2EFE9] mt-2">
            Forensic Parity & Signature Validator
          </h2>
          <p className="text-xs text-[#A39D95] mt-1 mb-6 max-w-2xl">
            Real-time I/O metrics, Reed-Solomon error correction validation, and raw cluster integrity logs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="kraft-card p-4 rounded relative border border-[#B39F73]">
              <div className="evidence-pin evidence-pin-top-center"></div>
              <div className="flex items-center justify-between text-xs font-mono text-[#4A5560]">
                <span className="font-semibold uppercase">Memory Buffer</span>
                <Gauge className="w-4 h-4 text-[#14110F]" />
              </div>
              <p className="font-document text-2xl font-bold text-[#14110F] mt-2">1.8 / 16 GB</p>
              <p className="text-[10px] font-mono text-[#4C7A5E] font-medium mt-1">Direct I/O zero-copy stream</p>
            </div>

            <div className="kraft-card p-4 rounded relative border border-[#B39F73]">
              <div className="evidence-pin evidence-pin-top-center"></div>
              <div className="flex items-center justify-between text-xs font-mono text-[#4A5560]">
                <span className="font-semibold uppercase">ECC Parity Accuracy</span>
                <ShieldCheck className="w-4 h-4 text-[#4C7A5E]" />
              </div>
              <p className="font-document text-2xl font-bold text-[#4C7A5E] mt-2">99.98%</p>
              <p className="text-[10px] font-mono text-[#14110F] font-medium mt-1">Reed-Solomon decoding active</p>
            </div>

            <div className="kraft-card p-4 rounded relative border border-[#B39F73]">
              <div className="evidence-pin evidence-pin-top-center"></div>
              <div className="flex items-center justify-between text-xs font-mono text-[#4A5560]">
                <span className="font-semibold uppercase">Signature Engine</span>
                <Zap className="w-4 h-4 text-[#B33A2E]" />
              </div>
              <p className="font-document text-2xl font-bold text-[#B33A2E] mt-2">v4.2 Heuristic</p>
              <p className="text-[10px] font-mono text-[#14110F] font-medium mt-1">45,000 magic signatures loaded</p>
            </div>
          </div>

          {/* Sector Integrity Heatmap */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-[#A39D95]">
              <span className="font-semibold uppercase text-[#F2EFE9]">
                Cluster Sector Heatmap (#0x0000 - #0x5FFF)
              </span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#4C7A5E]"></span> Verified</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#D8C39A]"></span> Recognized</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#B33A2E]"></span> Damaged</span>
              </span>
            </div>
            <div className="grid grid-cols-16 sm:grid-cols-32 gap-1 p-3 rounded bg-[#171412] border border-[#2F2926]">
              {Array.from({ length: 96 }).map((_, i) => {
                const color = i === 14 || i === 42 || i === 78 ? 'bg-[#B33A2E]' : i % 4 === 0 ? 'bg-[#D8C39A]' : 'bg-[#4C7A5E]';
                return (
                  <div
                    key={i}
                    title={`Sector #0x00${(i * 128).toString(16)}`}
                    className={`h-4 rounded-[1px] ${color} opacity-85 hover:opacity-100 hover:scale-125 transition-all cursor-pointer`}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
