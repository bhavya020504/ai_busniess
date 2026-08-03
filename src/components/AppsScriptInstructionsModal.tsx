import React, { useState, useEffect } from 'react';
import { getStoredWebAppUrl, setStoredWebAppUrl } from '../config/api';
import { X, Copy, Check, FileCode, CheckCircle2, ExternalLink, Save } from 'lucide-react';

interface AppsScriptInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppsScriptInstructionsModal: React.FC<AppsScriptInstructionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [webAppUrl, setWebAppUrl] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setWebAppUrl(getStoredWebAppUrl());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredWebAppUrl(webAppUrl);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const appsScriptCode = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create column headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Company Name",
        "Contact Person",
        "Business Email",
        "Phone Number",
        "Industry",
        "Call Status",
        "Lead ID"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0f172a");
      headerRange.setFontColor("#ffffff");
    }
    
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    }
    
    var timestamp = new Date();
    var companyName = data.companyName || data['Company Name'] || '';
    var contactPerson = data.contactPerson || data['Contact Person'] || '';
    var businessEmail = data.businessEmail || data['Business Email'] || '';
    var phoneNumber = data.phoneNumber || data['Phone Number'] || '';
    var industry = data.industry || data['Industry'] || '';
    var callStatus = "NEW_LEAD_PENDING_CALL";
    var leadId = "AIB-" + Math.floor(100000 + Math.random() * 900000);
    
    // Append row to Google Sheet
    sheet.appendRow([
      timestamp,
      companyName,
      contactPerson,
      businessEmail,
      phoneNumber,
      industry,
      callStatus,
      leadId
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        status: 200,
        message: "Thank you! Your request has been received. Our AI Consultant will contact you shortly.",
        leadId: leadId
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        status: 500,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0d1322] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-500/30 text-indigo-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Google Sheets Integration Setup</h3>
              <p className="text-xs text-slate-400">Store leads & trigger call workflows automatically</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {/* Step 1: Save Endpoint */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              Configure Web App URL Endpoint
            </h4>
            <p className="text-xs text-slate-400">
              Paste your deployed Google Apps Script Web App URL below (starts with <code>https://script.google.com/...</code>):
            </p>
            <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={webAppUrl}
                onChange={(e) => setWebAppUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Endpoint</span>
              </button>
            </form>

            {savedSuccess && (
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Web App URL saved successfully!
              </p>
            )}
          </div>

          {/* Step 2: Code Snippet */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                Google Apps Script Code (`Code.gs`)
              </h4>
              <button
                onClick={copyCodeToClipboard}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#080c14]">
              <pre className="p-4 text-xs font-mono text-indigo-200 overflow-x-auto max-h-48 leading-relaxed">
                <code>{appsScriptCode}</code>
              </pre>
            </div>
          </div>

          {/* Step 3: Quick Deployment Instructions */}
          <div className="space-y-3 pt-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">3</span>
              Deployment Checklist
            </h4>

            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <li>
                Open a new Google Sheet at{' '}
                <a
                  href="https://sheets.new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline font-medium inline-flex items-center gap-1"
                >
                  sheets.new <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Click <strong>Extensions &gt; Apps Script</strong>.</li>
              <li>Paste the code above into <code>Code.gs</code> and click <strong>Save</strong>.</li>
              <li>Click <strong>Deploy &gt; New deployment</strong> and select <strong>Web app</strong>.</li>
              <li>
                Set <strong>Execute as:</strong> <em>Me</em> and <strong>Who has access:</strong> <em>Anyone</em>.
              </li>
              <li>Authorize permissions, copy the generated Web App URL, and paste it in Step 1 above.</li>
            </ol>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
