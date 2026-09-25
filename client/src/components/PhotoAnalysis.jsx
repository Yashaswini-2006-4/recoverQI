import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Tag,
  Pin,
  Download,
  Eye,
  Sliders,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Hash,
  Layers,
  FileCheck
} from 'lucide-react';
import IntegrityBadge from './IntegrityBadge';
import { downloadArtifact } from '../services/api';

const samplePhoto = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='480' height='320' viewBox='0 0 480 320'><defs><linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23111827'/><stop offset='100%' stop-color='%231e1b4b'/></linearGradient><linearGradient id='grid' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' stop-color='%2338bdf8' stop-opacity='0.2'/><stop offset='100%' stop-color='%236366f1' stop-opacity='0.4'/></linearGradient></defs><rect width='480' height='320' fill='url(%23bg)'/><circle cx='240' cy='130' r='60' fill='%2334d399' opacity='0.3'/><circle cx='240' cy='130' r='40' fill='%2360a5fa' opacity='0.5'/><rect x='80' y='210' width='320' height='60' rx='8' fill='%231e293b' stroke='%23475569'/><text x='100' y='245' fill='%2338bdf8' font-size='14' font-family='monospace' font-weight='bold'>CARVED PHOTO CLUSTER #0x00000201</text><text x='100' y='262' fill='%2394a3b8' font-size='10' font-family='monospace'>MAGIC BYTES: [FF D8 FF E0] • JPEG / JFIF FORENSIC STREAM</text><circle cx='360' cy='60' r='20' fill='%23f59e0b' opacity='0.8'/><text x='20' y='30' fill='%23ef4444' font-size='12' font-family='monospace' font-weight='bold'>[CONFIDENTIAL EVIDENCE - EXHIBIT A]</text></svg>";

const sampleSchematic = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='480' height='320' viewBox='0 0 480 320'><rect width='480' height='320' fill='%230f172a'/><g stroke='%2338bdf8' stroke-width='1.5' fill='none' opacity='0.7'><circle cx='140' cy='160' r='50'/><circle cx='340' cy='160' r='50'/><line x1='190' y1='160' x2='290' y2='160'/><line x1='140' y1='110' x2='140' y2='60'/><line x1='340' y1='110' x2='340' y2='60'/></g><rect x='200' y='140' width='80' height='40' rx='4' fill='%231e293b' stroke='%236366f1'/><text x='215' y='165' fill='%2338bdf8' font-size='11' font-family='monospace'>PARITY</text><text x='20' y='30' fill='%2310b981' font-size='12' font-family='monospace' font-weight='bold'>[PNG SCHEMATIC - EXHIBIT B]</text></svg>";

export default function PhotoAnalysis({ artifacts = [], scanResult = null, onClose }) {
  const imageArtifacts = artifacts.filter(
    (a) => a.type === 'Image' || /\.(jpe?g|png|gif|webp)$/i.test(a.name)
  );

  const [selectedPhoto, setSelectedPhoto] = useState(
    imageArtifacts[0] || {
      id: "art-102",
      name: "crime_scene_surveillance_01.jpg",
      path: "/Forensics/Images/crime_scene_surveillance_01.jpg",
      size: "3.2 MB",
      type: "Image",
      status: "Recovered",
      integrity: "valid",
      priority: "High",
      confidence: 98.7,
      previewUrl: samplePhoto,
      checksum: "7a9128f1c849102c918349201938204928394820182948201928394819284920",
      recoveredAt: "2026-09-25 14:12"
    }
  );

  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [colorMode, setColorMode] = useState('normal'); // 'normal', 'rgb', 'edges', 'forensic'
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementDone, setEnhancementDone] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleEnhance = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      setIsEnhancing(false);
      setEnhancementDone(true);
      setNotice("Neural sector de-quantization and cluster edge tracing complete!");
      setTimeout(() => setNotice(null), 3500);
    }, 1200);
  };

  const handleDownloadPhoto = async () => {
    setNotice(`Exporting evidence photo: ${selectedPhoto.name}`);
    await downloadArtifact(scanResult?.scanId || "SCN-20260925-8842", selectedPhoto.id, selectedPhoto.name);
    setTimeout(() => setNotice(null), 3000);
  };

  const imgSrc = selectedPhoto.previewUrl || samplePhoto;

  return (
    <div className="space-y-6">
      {/* Evidence Board Pin Header */}
      <div className="ink-card rounded-lg p-6 sm:p-8 border border-[#2F2926] relative">
        <div className="evidence-pin evidence-pin-top-left"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rubber-stamp text-xs">
                PHOTO FORENSICS LAB
              </span>
              <span className="text-xs font-mono text-[#D8C39A]">
                EXHIBIT IMAGE DEEP CARVER
              </span>
            </div>
            <h2 className="font-document text-2xl font-bold text-[#F2EFE9] mt-2">
              Forensic Image Analysis & Magic Byte Inspector
            </h2>
            <p className="text-xs text-[#A39D95] mt-1 max-w-2xl">
              Inspect carved raster bitstreams, verify magic signatures [FF D8 FF], de-mosaic unallocated clusters, and extract cryptographic SHA-256 evidence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded bg-[#25201D] hover:bg-[#2F2926] text-[#A39D95] text-xs font-mono border border-[#3A332F] cursor-pointer"
              >
                Back to Evidence Board
              </button>
            )}
            <button
              type="button"
              onClick={handleDownloadPhoto}
              className="flex items-center gap-2 px-4 py-2 rounded bg-[#B33A2E] hover:bg-[#9B2F25] text-[#F2EFE9] text-xs font-document font-bold shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download Photo Evidence
            </button>
          </div>
        </div>
      </div>

      {/* Notice Alert */}
      {notice && (
        <div className="p-3 rounded bg-[#171412] border border-[#4C7A5E]/50 text-[#4C7A5E] text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Main Analysis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Canvas & Viewer */}
        <div className="lg:col-span-2 ink-card rounded-lg p-5 border border-[#2F2926] flex flex-col justify-between relative">
          <div className="evidence-pin evidence-pin-top-left"></div>

          {/* Canvas Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2F2926]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-document font-bold text-[#F2EFE9] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#B33A2E]" />
                {selectedPhoto.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#25201D] text-[#D8C39A]">
                {selectedPhoto.size}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                className="p-1.5 rounded bg-[#25201D] hover:bg-[#2F2926] text-[#F2EFE9] border border-[#3A332F] cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[#D8C39A]">{Math.round(zoomLevel * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                className="p-1.5 rounded bg-[#25201D] hover:bg-[#2F2926] text-[#F2EFE9] border border-[#3A332F] cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 rounded bg-[#25201D] hover:bg-[#2F2926] text-[#F2EFE9] border border-[#3A332F] cursor-pointer ml-1"
                title="Rotate 90deg"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Viewport Display Area */}
          <div className="my-4 p-4 rounded bg-[#0D0B0A] border border-[#2F2926] min-h-[340px] flex items-center justify-center overflow-hidden relative select-none">
            <div
              className="transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                filter:
                  colorMode === 'edges'
                    ? 'contrast(200%) grayscale(100%) invert(100%)'
                    : colorMode === 'rgb'
                    ? 'saturate(250%) contrast(120%)'
                    : colorMode === 'forensic'
                    ? 'hue-rotate(180deg) contrast(150%)'
                    : 'none'
              }}
            >
              <img
                src={imgSrc}
                alt={selectedPhoto.name}
                className="max-h-[320px] max-w-full rounded shadow-xl object-contain"
              />
            </div>

            {enhancementDone && (
              <div className="absolute top-4 right-4 rubber-stamp-verified text-xs bg-[#14110F]/90">
                100% RECONSTRUCTED
              </div>
            )}
          </div>

          {/* Filter Modes & Deep Reconstruct Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#2F2926] text-xs font-mono">
            <div className="flex items-center gap-1">
              <span className="text-[#A39D95] mr-1">Layer:</span>
              {['normal', 'rgb', 'edges', 'forensic'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setColorMode(mode)}
                  className={`px-2.5 py-1 rounded capitalize transition cursor-pointer ${
                    colorMode === mode
                      ? 'bg-[#D8C39A] text-[#14110F] font-bold'
                      : 'bg-[#1E1B18] text-[#A39D95] hover:text-[#F2EFE9]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleEnhance}
              disabled={isEnhancing}
              className="flex items-center justify-center gap-2 px-4 py-1.5 rounded bg-[#4C7A5E] hover:bg-[#3D634C] text-[#F2EFE9] font-document font-bold transition shadow cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isEnhancing ? "Reconstructing Clusters..." : "Reconstruct Photo Clusters"}
            </button>
          </div>
        </div>

        {/* Right: Forensic Metadata & Available Photos */}
        <div className="space-y-4">
          {/* Card 1: Forensic Metadata Docket */}
          <div className="kraft-card rounded-lg p-5 relative shadow-md space-y-3">
            <div className="evidence-pin evidence-pin-top-center"></div>

            <div className="flex items-center justify-between border-b border-[#B39F73] pb-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#B33A2E] flex items-center gap-1">
                <Tag className="w-3 h-3" /> EVIDENCE DOSSIER
              </span>
              <span className="text-[10px] font-mono text-[#4A5560]">
                {selectedPhoto.id}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#4A5560] block">Volume Path:</span>
                <p className="font-mono text-[11px] text-[#14110F] bg-[#E8DCC2] p-1.5 rounded border border-[#B39F73] truncate">
                  {selectedPhoto.path}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#E8DCC2] p-2 rounded border border-[#B39F73]">
                  <span className="text-[10px] font-mono uppercase text-[#4A5560] block">Magic Header:</span>
                  <p className="font-mono text-[11px] font-bold text-[#B33A2E] mt-0.5">
                    FF D8 FF E0 (JPEG)
                  </p>
                </div>
                <div className="bg-[#E8DCC2] p-2 rounded border border-[#B39F73]">
                  <span className="text-[10px] font-mono uppercase text-[#4A5560] block">Parity State:</span>
                  <div className="mt-0.5">
                    <IntegrityBadge integrity={selectedPhoto.integrity} confidence={selectedPhoto.confidence} />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#4A5560] block">SHA-256 Checksum:</span>
                <p className="font-mono text-[10px] text-[#14110F] bg-[#E8DCC2] p-2 rounded border border-[#B39F73] break-all font-semibold">
                  {selectedPhoto.checksum}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#B39F73]/50 flex items-center justify-between text-[11px] font-mono text-[#4A5560]">
              <span>Resolution: 1920 × 1080</span>
              <span className="text-[#4C7A5E] font-bold">NIST-800-88 Valid</span>
            </div>
          </div>

          {/* Card 2: Recovered Photo Gallery */}
          <div className="ink-card rounded-lg p-4 border border-[#2F2926] space-y-3">
            <h4 className="font-document text-xs font-bold text-[#F2EFE9] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#D8C39A]" />
              Recovered Photos in Case File
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {[
                {
                  id: "art-102",
                  name: "crime_scene_surveillance_01.jpg",
                  previewUrl: samplePhoto,
                  size: "3.2 MB",
                  type: "Image",
                  status: "Recovered",
                  integrity: "valid",
                  priority: "High",
                  checksum: "7a9128f1c849102c918349201938204928394820182948201928394819284920",
                  path: "/Forensics/Images/crime_scene_surveillance_01.jpg"
                },
                {
                  id: "art-104",
                  name: "forensic_camera_dump_raw.png",
                  previewUrl: sampleSchematic,
                  size: "12.4 MB",
                  type: "Image",
                  status: "Partial",
                  integrity: "partial",
                  priority: "Medium",
                  checksum: "f1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6",
                  path: "/Forensics/RawShots/forensic_camera_dump_raw.png"
                },
                ...imageArtifacts.filter(a => a.id !== "art-102" && a.id !== "art-104")
              ].map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedPhoto(art)}
                  className={`flex items-center gap-3 p-2 rounded border cursor-pointer transition ${
                    selectedPhoto.id === art.id
                      ? 'bg-[#25201D] border-[#B33A2E]'
                      : 'bg-[#171412] border-[#2F2926] hover:border-[#3A332F]'
                  }`}
                >
                  <div className="w-10 h-8 rounded overflow-hidden bg-black flex-shrink-0 border border-[#3A332F]">
                    <img src={art.previewUrl || samplePhoto} alt={art.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-document font-bold text-[#F2EFE9] truncate">{art.name}</p>
                    <p className="text-[10px] font-mono text-[#A39D95]">{art.size} • {art.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
