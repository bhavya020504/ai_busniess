import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Capabilities } from './components/Capabilities';
import { Process } from './components/Process';
import { LeadForm } from './components/LeadForm';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { LeadDashboardModal } from './components/LeadDashboardModal';

export const App: React.FC = () => {
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans relative selection:bg-indigo-600 selection:text-white">
      {/* Sticky Header */}
      <Navbar onOpenDashboard={() => setIsDashboardModalOpen(true)} />

      {/* Main Single Page Sections */}
      <main>
        <Hero />
        <Capabilities />
        <Process />
        <LeadForm />
        <FAQ />
      </main>

      {/* Footer */}
      <Footer onOpenDashboard={() => setIsDashboardModalOpen(true)} />

      {/* Admin Lead Records & Call Control Portal (Protected) */}
      <LeadDashboardModal
        isOpen={isDashboardModalOpen}
        onClose={() => setIsDashboardModalOpen(false)}
      />
    </div>
  );
};

export default App;
