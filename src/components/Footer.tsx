import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDashboard }) => {
  return (
    <footer className="bg-[#060910] border-t border-slate-800/80 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">AIBridge</span>
            <span className="block text-[10px] text-slate-500">Enterprise AI Discovery Platform</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              const el = document.getElementById('capabilities');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-slate-200 transition-colors cursor-pointer"
          >
            Capabilities
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('process');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-slate-200 transition-colors cursor-pointer"
          >
            Discovery Process
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('faq');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-slate-200 transition-colors cursor-pointer"
          >
            FAQ
          </button>
          <button
            onClick={onOpenDashboard}
            className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Copyright */}
        <div className="text-slate-500 text-center md:text-right">
          © {new Date().getFullYear()} AIBridge Technologies Inc. All rights reserved.
        </div>

      </div>
    </footer>
  );
};
