import React from 'react';
import StorageMap from '../components/StorageMap';
import { Layers, Tag, Pin } from 'lucide-react';

export default function StoragePage() {
  return (
    <div className="space-y-6">
      <div className="ink-card rounded-lg p-6 sm:p-8 relative border border-[#2F2926]">
        <div className="evidence-pin evidence-pin-top-left"></div>
        <div className="pl-3">
          <div className="flex items-center gap-2">
            <span className="rubber-stamp text-xs">
              STORAGE DIGITAL TWIN
            </span>
            <span className="text-xs font-mono text-[#D8C39A]">
              PHYSICAL SECTOR GRID #0x0000 - #0xFFFF
            </span>
          </div>
          <h2 className="font-document text-2xl font-bold text-[#F2EFE9] mt-2">
            Sector Geometry & Raw Cluster Digital Twin
          </h2>
          <p className="text-xs text-[#A39D95] mt-1 max-w-2xl">
            Interactive grid representing raw disk sectors, unallocated cluster chains, and recovered artifact offsets.
          </p>
        </div>
      </div>

      <StorageMap />
    </div>
  );
}
