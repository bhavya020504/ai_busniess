import React from 'react';
import { Search, MapPin, FileCheck, Compass } from 'lucide-react';

export const Process: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Initial AI Discovery',
      description: 'We review your business processes, data flows, and team bottlenecks during our 45-minute consultation.',
    },
    {
      number: '02',
      icon: MapPin,
      title: 'Opportunity Mapping',
      description: 'We identify repetitive tasks and data workflows that can be automated with high-accuracy AI models.',
    },
    {
      number: '03',
      icon: FileCheck,
      title: 'ROI Blueprint',
      description: 'You receive a custom ROI forecast detailing estimated hours saved, cost reductions, and tech stack requirements.',
    },
    {
      number: '04',
      icon: Compass,
      title: 'Execution Strategy',
      description: 'We provide a phased implementation roadmap for your team to build, integrate, and scale enterprise AI.',
    },
  ];

  return (
    <section id="process" className="py-24 relative bg-[#0b0f19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Structured Consultation</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            How Your Free AI Audit Works
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            No generic pitches. A clear 4-step framework designed to deliver immediate technical clarity and actionable insights.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-700 font-mono">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-700">
                    <span className="text-lg font-bold">→</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
