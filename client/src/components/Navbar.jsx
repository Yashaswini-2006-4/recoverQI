import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pin, Folder, FileText, Network, Layers, ShieldCheck, Tag, Terminal } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const tabs = [
    { name: 'Evidence Vault', path: '/', icon: Tag },
    { name: 'Reconstruction Lab', path: '/lab', icon: Network },
    { name: 'Storage Digital Twin', path: '/storage', icon: Layers },
    { name: 'Integrity Center', path: '/diagnostics', icon: ShieldCheck },
  ];

  return (
    <header className="border-b border-[#2F2926] bg-[#14110F] sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Dossier Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded bg-[#B33A2E] flex items-center justify-center text-[#F2EFE9] shadow-md relative">
              <Pin className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D8C39A] border border-[#14110F]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-document text-xl font-bold tracking-tight text-[#F2EFE9] group-hover:text-[#D8C39A] transition-colors">
                  Recover<span className="text-[#B33A2E]">IQ</span>
                </span>
                <span className="rubber-stamp text-[10px] py-0 px-1.5 leading-none">
                  EVIDENCE BOARD
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#A39D95]">Digital Forensic Reconstruction Workbench</p>
            </div>
          </Link>

          {/* Manila Folder Style Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path || (tab.path === '/' && location.pathname.startsWith('/results'));
              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`folder-tab flex items-center gap-2 px-4 py-2 rounded-t text-xs font-mono tracking-wide ${
                    isActive ? 'active' : ''
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B33A2E]' : 'text-[#A39D95]'}`} />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Case Badge & Branch */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1C1816] border border-[#2F2926] text-[#D8C39A] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#4C7A5E]"></span>
              <span>Case Docket Active</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1C1816] border border-[#2F2926] text-[#A39D95] text-xs font-mono">
              <Terminal className="w-3.5 h-3.5 text-[#B33A2E]" />
              <span>member-2</span>
            </div>
          </div>
        </div>

        {/* Mobile Folder Tabs Strip */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-[#2F2926]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path || (tab.path === '/' && location.pathname.startsWith('/results'));
            return (
              <Link
                key={tab.name}
                to={tab.path}
                className={`folder-tab flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-mono ${
                  isActive ? 'active' : ''
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-[#B33A2E]' : 'text-[#A39D95]'}`} />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
