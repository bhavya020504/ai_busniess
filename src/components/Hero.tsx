import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Bot, Layers, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToForm = () => {
    const element = document.getElementById('consultation-form');
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
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-radial-glow">
      {/* Background Decor Grid & Orbs */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Top Enterprise Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide mb-8 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>AI Discovery & Automation Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          {/* Title - Exact requirement: "Transform Your Business with AI" */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            <span className="block text-gradient">Transform Your</span>
            <span className="text-gradient-primary">Business with AI</span>
          </h1>

          {/* Subtitle - Exact requirement: "Book a free AI consultation and discover where AI can automate your business." */}
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl font-normal leading-relaxed">
            Book a free AI consultation and discover where AI can automate your business.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-16">
            {/* Primary CTA - Exact requirement: "Get Free AI Consultation" */}
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Get Free AI Consultation</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-cyan-200" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('capabilities');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Explore Capabilities</span>
            </button>
          </div>

          {/* Key Value Guarantee Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-400 py-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Free Initial Assessment</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-400 py-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Enterprise Data Security</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-400 py-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Tailored ROI Roadmap</span>
            </div>
          </div>

        </div>

        {/* Dashboard / ROI Visual Mockup Feature Element */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-100 transition duration-1000"></div>
          
          <div className="relative glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/70 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-mono text-slate-400 ml-2">AI Discovery Engine v4.2</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-md border border-cyan-800/50">
                <Layers className="w-3.5 h-3.5" />
                <span>ACTIVE AUDIT FRAMEWORK</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Automated Workflows</div>
                  <div className="text-2xl font-bold text-white mb-2">65% Time Saved</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Identify manual data entry & routine operational bottlenecks ready for instant AI agent execution.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Efficiency Boost</span>
                  <span className="text-emerald-400 font-bold">+3.8x ROI</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Custom Knowledge LLM</div>
                  <div className="text-2xl font-bold text-indigo-300 mb-2">Zero Data Leaks</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Secure local & cloud enterprise vector search trained specifically on your internal documents.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Security Standard</span>
                  <span className="text-indigo-400 font-bold">SOC2 / HIPAA</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Predictive Analytics</div>
                  <div className="text-2xl font-bold text-cyan-300 mb-2">Real-time Forecasts</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Leverage historical enterprise data to predict demand, reduce churn, and streamline inventory.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Accuracy Score</span>
                  <span className="text-cyan-400 font-bold">98.4% Precision</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
