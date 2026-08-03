import { Cpu, Workflow, Database, ShieldAlert, BarChart3, Bot } from 'lucide-react';

export const Capabilities: React.FC = () => {
  const capabilities = [
    {
      icon: Workflow,
      title: 'Workflow Automation',
      description: 'Streamline repetitive administrative tasks, invoice processing, and operational workflows with intelligent AI agents.',
      badge: 'Operational Efficiency',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: Cpu,
      title: 'Custom LLM & Knowledge Bases',
      description: 'Unlock enterprise knowledge by transforming unstructured documents into an instant semantic search & query engine.',
      badge: 'Knowledge Retrieval',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: BarChart3,
      title: 'Predictive Analytics',
      description: 'Utilize ML models to anticipate customer demand, optimize inventory management, and forecast business metrics.',
      badge: 'Data Intelligence',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: ShieldAlert,
      title: 'Governance & Security Compliance',
      description: 'Ensure strict data isolation, zero public API leakage, and full SOC2/GDPR compliance across all AI integrations.',
      badge: 'Enterprise Security',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <section id="capabilities" className="py-24 relative bg-[#090d16] border-t border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Bot className="w-3.5 h-3.5" />
            <span>Enterprise Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Where AI Creates Immediate ROI
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            During your free consultation, our senior AI architects audit your existing technical stack to pinpoint high-value automation opportunities.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="glass-card glass-card-hover rounded-2xl p-8 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} p-0.5 shadow-lg`}>
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-indigo-400">
                  <Database className="w-3.5 h-3.5" />
                  <span>Audited during 1-on-1 discovery call</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
