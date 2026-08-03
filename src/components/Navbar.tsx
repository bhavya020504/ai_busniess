import React, { useState, useEffect } from 'react';
import { Cpu, ArrowRight, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDashboard }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080c14]/85 backdrop-blur-md border-b border-slate-800/80 py-3.5 shadow-xl shadow-indigo-950/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#0b0f19] rounded-[11px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                AIBridge
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 -mt-1">
                Enterprise AI
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('capabilities')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollToSection('process')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Discovery Process
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Discreet Admin Portal Access Button */}
            <button
              onClick={onOpenDashboard}
              className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-indigo-300 hover:border-slate-700 transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              title="Admin Portal Access"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400 hover:text-indigo-400" />
              <span className="text-[11px]">Admin Portal</span>
            </button>

            <button
              onClick={() => scrollToSection('consultation-form')}
              className="relative group overflow-hidden rounded-lg p-[1px] font-semibold text-sm cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 group-hover:opacity-90 transition-opacity"></span>
              <span className="relative px-5 py-2.5 rounded-[7px] bg-[#0b0f19] text-white flex items-center gap-2 group-hover:bg-opacity-90 transition-all">
                Get Free AI Consultation
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenDashboard}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400"
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 pb-6 border-t border-slate-800/80 bg-[#0c121e]/95 backdrop-blur-xl rounded-2xl px-4 flex flex-col gap-4 shadow-2xl">
            <button
              onClick={() => scrollToSection('capabilities')}
              className="text-left text-base font-medium text-slate-200 py-2 border-b border-slate-800/60"
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollToSection('process')}
              className="text-left text-base font-medium text-slate-200 py-2 border-b border-slate-800/60"
            >
              Discovery Process
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-left text-base font-medium text-slate-200 py-2 border-b border-slate-800/60"
            >
              FAQ
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDashboard();
              }}
              className="text-left text-base font-medium text-indigo-400 py-2 border-b border-slate-800/60 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal Access</span>
            </button>
            <button
              onClick={() => scrollToSection('consultation-form')}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-center shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Get Free AI Consultation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
