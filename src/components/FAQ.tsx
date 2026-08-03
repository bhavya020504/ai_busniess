import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is included in the free AI consultation?',
      answer: 'Our free 45-minute discovery session includes a comprehensive audit of your manual workflows, identification of high-ROI automation opportunities, data privacy evaluation, and a custom architectural blueprint tailored to your tech stack.',
    },
    {
      question: 'How is our company data protected during the audit?',
      answer: 'Data security is our top priority. We operate under strict Non-Disclosure Agreements (NDAs) and do not retain or train public models on your proprietary business metrics.',
    },
    {
      question: 'Which industries do you specialize in?',
      answer: 'We specialize in enterprise automation across Healthcare, Manufacturing, Logistics, Retail, Banking, Education, and custom tech organizations. Our models adapt to domain-specific compliance standards (HIPAA, SOC2, GDPR).',
    },
    {
      question: 'Is there any commitment required after the free session?',
      answer: 'Zero commitment. The discovery audit and ROI roadmap are 100% free with no obligation to purchase further implementation services.',
    },
    {
      question: 'How does the Google Sheets lead integration work?',
      answer: 'When you submit the request form above, your details are instantly logged into a secure Google Sheet using a lightweight Google Apps Script Web App endpoint, ensuring fast & reliable lead capture.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative bg-[#090d16] border-t border-slate-800/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Everything you need to know about our enterprise AI discovery process.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="glass-card rounded-xl border border-slate-800/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-indigo-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/40 pt-4 bg-slate-950/40">
                    {faq.answer}
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
