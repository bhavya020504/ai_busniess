import React, { useState, useEffect } from 'react';
import { ADMIN_PASSWORD, NEON_DASHBOARD_URL } from '../config/api';

import { ADMIN_PASSWORD } from '../config/api';

interface Lead {
  id: number;
  lead_id: string;
  company_name: string;
  contact_person: string;
  business_email: string;
  phone_number: string;
  industry: string;
  call_status: string;
  created_at: string;
}

interface LeadDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadDashboardModal: React.FC<LeadDashboardModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callingLeadId, setCallingLeadId] = useState<string | null>(null);
  const [callSuccessMessage, setCallSuccessMessage] = useState<string | null>(null);

  const ADMIN_PASSCODE = ADMIN_PASSWORD || 'admin123';

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchLeads();
    }
  }, [isOpen, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setPasscodeError(null);
      setPasscode('');
    } else {
      setPasscodeError('Invalid Admin Passcode. Please try again.');
    }
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/api/leads', {
        headers: { Authorization: ADMIN_PASSWORD },
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      } else {
        setError(data.message || 'Failed to fetch leads from Neon DB.');
      }
    } catch (err: any) {
      setError('Could not connect to Neon DB API server at http://localhost:3001');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerCall = async (lead: Lead) => {
    setCallingLeadId(lead.lead_id);
    setCallSuccessMessage(null);

    try {
      const res = await fetch(`http://localhost:3001/api/leads/${lead.lead_id}/trigger-call`, {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success) {
        setCallSuccessMessage(`📞 Call initiated to ${lead.contact_person} (${lead.phone_number})!`);
        await fetchLeads();
      } else {
        alert(data.message || 'Failed to trigger call.');
      }
    } catch (err: any) {
      alert('Error triggering call: ' + err.message);
    } finally {
      setCallingLeadId(null);
      setTimeout(() => setCallSuccessMessage(null), 5000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0d1322] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
                  {/* Dashboard link */}
          {NEON_DASHBOARD_URL && (
            <a href={NEON_DASHBOARD_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-indigo-300 hover:text-white transition-colors">
              <Database className="w-4 h-4" />
              Neon Dashboard
            </a>
          )}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950 border border-indigo-500/30 text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">AIBridge Admin Lead Portal</h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-slate-400">Neon PostgreSQL Lead Records & Call Control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={fetchLeads}
                disabled={isLoading}
                className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-all text-xs font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50"
                title="Refresh Leads from Neon DB"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
                <span className="hidden sm:inline">Refresh DB</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsAuthenticated(false);
                onClose();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          /* Admin Authentication Passcode Screen */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center mb-6 text-indigo-400">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Admin Portal Authentication</h4>
            <p className="text-xs text-slate-400 mb-6">
              Enter your secret admin passcode to access Neon DB lead records.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Admin Passcode (e.g. admin123)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                  autoFocus
                />
              </div>

              {passcodeError && (
                <p className="text-xs text-rose-400 flex items-center gap-1 font-medium text-left">
                  <AlertCircle className="w-3.5 h-3.5" /> {passcodeError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Unlock Admin Portal
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard View */
          <>
            {callSuccessMessage && (
              <div className="bg-emerald-950/90 border-b border-emerald-800/80 px-6 py-3 text-xs text-emerald-200 font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{callSuccessMessage}</span>
              </div>
            )}

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {error && (
                <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs">
                  ⚠️ {error}
                </div>
              )}

              {isLoading && leads.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center gap-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
                  <span>Fetching leads from Neon PostgreSQL...</span>
                </div>
              ) : leads.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm bg-slate-900/40 rounded-2xl border border-slate-800">
                  <Lock className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                  <p className="font-semibold text-white mb-1">No Leads Stored Yet</p>
                  <p className="text-xs text-slate-400">Submissions from the public website will appear here in real time.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#080c14]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-300 uppercase tracking-wider font-semibold">
                        <th className="p-3.5">Lead ID</th>
                        <th className="p-3.5">Company & Contact</th>
                        <th className="p-3.5">Email & Phone</th>
                        <th className="p-3.5">Industry</th>
                        <th className="p-3.5">Call Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-3.5 font-mono text-indigo-300 font-semibold">
                            {lead.lead_id || `AIB-${lead.id}`}
                          </td>

                          <td className="p-3.5">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              {lead.company_name}
                            </div>
                            <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                              <User className="w-3 h-3 text-slate-500" />
                              {lead.contact_person}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <div className="text-slate-200 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-indigo-400" />
                              {lead.business_email}
                            </div>
                            <div className="text-cyan-300 text-[11px] font-mono flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-cyan-400" />
                              {lead.phone_number}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 font-medium">
                              {lead.industry}
                            </span>
                          </td>

                          <td className="p-3.5">
                            {lead.call_status === 'CALL_TRIGGERED' || lead.call_status === 'CALL_INITIATED' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-semibold text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                Call Triggered
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950 border border-amber-800 text-amber-300 font-semibold text-[10px]">
                                Pending Call
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => triggerCall(lead)}
                              disabled={callingLeadId === lead.lead_id}
                              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] transition-all flex items-center gap-1.5 ml-auto shadow-md cursor-pointer disabled:opacity-50"
                            >
                              <PhoneCall className={`w-3.5 h-3.5 ${callingLeadId === lead.lead_id ? 'animate-bounce' : ''}`} />
                              <span>{callingLeadId === lead.lead_id ? 'Calling...' : 'Trigger Call'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Connected to Neon DB: <strong>neondb</strong></span>
              </div>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  onClose();
                }}
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
              >
                Close Admin Portal
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
