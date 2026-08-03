import React, { useState } from 'react';
import { submitLeadToGoogleSheets, type LeadFormData } from '../config/api';
import { CheckCircle2, AlertCircle, Loader2, Send, Building2, User, Mail, Phone, Briefcase, Sparkles } from 'lucide-react';

export const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState<LeadFormData>({
    companyName: '',
    contactPerson: '',
    businessEmail: '',
    phoneNumber: '',
    industry: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const industryOptions = [
    'Healthcare',
    'Manufacturing',
    'Logistics',
    'Retail',
    'Banking',
    'Education',
    'Other',
  ];

  // Real-time Field Validation
  const validateField = (name: keyof LeadFormData, value: string): string => {
    if (!value.trim()) {
      return 'This field is required.';
    }

    if (name === 'businessEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) {
        return 'Please enter a valid business email address.';
      }
    }

    if (name === 'phoneNumber') {
      // Validate phone number: minimum 7 digits, allowing +, -, (), space
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        return 'Please enter a valid phone number (7-15 digits).';
      }
    }

    return '';
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change if valid
    if (errors[name as keyof LeadFormData]) {
      const errorMsg = validateField(name as keyof LeadFormData, value);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof LeadFormData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitLeadToGoogleSheets(formData);

      if (response.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          companyName: '',
          contactPerson: '',
          businessEmail: '',
          phoneNumber: '',
          industry: '',
        });
        setErrors({});
      } else {
        setServerError(response.message || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      setServerError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="consultation-form" className="py-24 relative bg-radial-glow-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero Risk • Free Audit</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Book Your Free AI Consultation
            </h2>
            
            <p className="text-slate-300 text-base sm:text-lg">
              Fill out the details below to schedule your 1-on-1 enterprise discovery session with an AI strategist.
            </p>
          </div>

          {/* Main Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-700/80 shadow-2xl relative overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none"></div>

            {submitSuccess ? (
              /* Success View */
              <div className="py-12 px-4 text-center flex flex-col items-center animate-fadeIn">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Request Submitted!
                </h3>
                
                {/* Required exact success text */}
                <p className="text-lg text-slate-200 font-medium max-w-xl mb-8 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  Thank you! Your request has been received. Our AI Consultant will contact you shortly.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700 cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              /* Form View */
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                
                {serverError && (
                  <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Submission Error</span>
                      <span>{serverError}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div>
                    <label htmlFor="companyName" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Company Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Acme Corp Inc."
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border ${
                          errors.companyName ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                        } text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:ring-2`}
                      />
                    </div>
                    {errors.companyName && (
                      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.companyName}
                      </p>
                    )}
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label htmlFor="contactPerson" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Contact Person <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        placeholder="Sarah Jenkins"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border ${
                          errors.contactPerson ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                        } text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:ring-2`}
                      />
                    </div>
                    {errors.contactPerson && (
                      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.contactPerson}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business Email */}
                  <div>
                    <label htmlFor="businessEmail" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Business Email <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        id="businessEmail"
                        name="businessEmail"
                        value={formData.businessEmail}
                        onChange={handleChange}
                        placeholder="sarah@acmecorp.com"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border ${
                          errors.businessEmail ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                        } text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:ring-2`}
                      />
                    </div>
                    {errors.businessEmail && (
                      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.businessEmail}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+1 (555) 019-2834"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border ${
                          errors.phoneNumber ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                        } text-white placeholder-slate-500 text-sm transition-all focus:outline-none focus:ring-2`}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" /> {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Industry Dropdown */}
                <div>
                  <label htmlFor="industry" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Industry <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border ${
                        errors.industry ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                      } text-white text-sm transition-all focus:outline-none focus:ring-2 appearance-none cursor-pointer`}
                    >
                      <option value="" disabled className="bg-slate-900 text-slate-500">
                        Select your industry...
                      </option>
                      {industryOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                      ▼
                    </div>
                  </div>
                  {errors.industry && (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" /> {errors.industry}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Request AI Consultation</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-xs text-slate-400 pt-2">
                  🔒 We respect your privacy. No spam. Your information is strictly used for your AI consultation.
                </p>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
