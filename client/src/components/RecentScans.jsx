import React from 'react';
import { sampleRecentScans } from '../data/mockData';
import { Tag, Pin, CheckCircle2, ArrowRight, Calendar, Folder } from 'lucide-react';

export default function RecentScans({ onSelectScan }) {
  return (
    <div className="ink-card rounded-lg p-6 sm:p-8 border border-[#2F2926] relative space-y-4">
      {/* Evidence Pin */}
      <div className="evidence-pin evidence-pin-top-left"></div>

      <div className="flex items-center justify-between pb-3 border-b border-[#2F2926] pl-3">
        <div>
          <h3 className="font-document text-xl font-bold text-[#F2EFE9] flex items-center gap-2">
            <Folder className="w-5 h-5 text-[#B33A2E]" />
            Previous Case Files & Volume Dockets
          </h3>
          <p className="text-xs text-[#A39D95] mt-0.5">
            Historical investigation logs pinned to the board.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleRecentScans.map((scan) => (
          <div
            key={scan.id}
            onClick={() => onSelectScan && onSelectScan(scan)}
            className="kraft-card p-5 rounded relative shadow-md hover:scale-[1.02] transition-transform cursor-pointer border border-[#B39F73]"
          >
            {/* Pushpin */}
            <div className="evidence-pin evidence-pin-top-center"></div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#4A5560] mb-2 border-b border-[#B39F73]/50 pb-1.5">
              <span className="font-bold text-[#B33A2E]">#{scan.id}</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {scan.date}
              </span>
            </div>

            <h4 className="font-document font-bold text-sm text-[#14110F] leading-snug">
              {scan.name}
            </h4>

            <div className="grid grid-cols-2 gap-2 my-3 text-xs font-mono text-[#14110F]">
              <div className="bg-[#E8DCC2] p-1.5 rounded border border-[#B39F73]">
                <span className="text-[10px] text-[#4A5560] block">Files:</span>
                <span className="font-bold">{scan.filesFound}</span>
              </div>
              <div className="bg-[#E8DCC2] p-1.5 rounded border border-[#B39F73]">
                <span className="text-[10px] text-[#4A5560] block">Recovered:</span>
                <span className="font-bold text-[#4C7A5E]">{scan.size}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#B39F73]/50 text-xs font-mono">
              <span className="inline-flex items-center gap-1 text-[#4C7A5E] font-bold">
                <CheckCircle2 className="w-3 h-3" />
                {scan.health} parity
              </span>
              <span className="text-[#B33A2E] font-bold flex items-center gap-1">
                Open Docket <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
