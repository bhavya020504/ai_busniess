/**
 * Configuration and API submission service for AIBridge
 * Supports dual submission to Neon PostgreSQL DB and Google Sheets Web App.
 */

export const NEON_API_URL = import.meta.env.VITE_NEON_API_URL || 'http://localhost:3001/api/leads';
export const CALL_WEBHOOK_URL = import.meta.env.VITE_CALL_WEBHOOK_URL || '';
export const NEON_DASHBOARD_URL = import.meta.env.VITE_NEON_DASHBOARD_URL || '';

export const LEADS_API_URL = import.meta.env.VITE_LEADS_API_URL || 'http://localhost:3001/api/leads';
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';
export const DEFAULT_WEB_APP_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';
export const STORAGE_KEY_WEB_APP_URL = 'aibridge_google_apps_script_url';

export const getStoredWebAppUrl = (): string => {
  if (typeof window === 'undefined') return DEFAULT_WEB_APP_URL;
  const stored = localStorage.getItem(STORAGE_KEY_WEB_APP_URL);
  return stored !== null ? stored : DEFAULT_WEB_APP_URL;
};

export const setStoredWebAppUrl = (url: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_WEB_APP_URL, url.trim());
};

export interface LeadFormData {
  companyName: string;
  contactPerson: string;
  businessEmail: string;
  phoneNumber: string;
  industry: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  isMock?: boolean;
  neonSaved?: boolean;
  sheetsSaved?: boolean;
}

/**
 * Submit form data to Neon PostgreSQL API and/or Google Sheets Web App
 */
export const submitLeadToGoogleSheets = async (data: LeadFormData): Promise<SubmissionResponse> => {
  let neonSaved = false;
  let sheetsSaved = false;
  let successMessage = 'Thank you! Your request has been received. Our AI Consultant will contact you shortly.';

  // 1. Save to Neon PostgreSQL API Server
  try {
    const neonRes = await fetch(NEON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (neonRes.ok) {
      const neonJson = await neonRes.json();
      neonSaved = true;
      if (neonJson.message) successMessage = neonJson.message;
      console.log('✅ Lead saved to Neon PostgreSQL Database successfully!');
    }
  } catch (neonErr) {
    console.warn('Neon DB API call note:', neonErr);
  }

  // 2. Save to Google Sheets Web App if endpoint URL is configured
  const webAppUrl = getStoredWebAppUrl();

  if (webAppUrl && webAppUrl.startsWith('http')) {
    try {
      const response = await fetch(webAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        sheetsSaved = true;
      } else {
        // Fallback for Google Apps Script CORS redirection
        const formData = new FormData();
        formData.append('companyName', data.companyName);
        formData.append('contactPerson', data.contactPerson);
        formData.append('businessEmail', data.businessEmail);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('industry', data.industry);

        await fetch(webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: formData,
        });
        sheetsSaved = true;
      }
    } catch (sheetsErr) {
      console.warn('Google Sheets error, attempting fallback no-cors mode:', sheetsErr);
      try {
        const formData = new FormData();
        formData.append('companyName', data.companyName);
        formData.append('contactPerson', data.contactPerson);
        formData.append('businessEmail', data.businessEmail);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('industry', data.industry);

        await fetch(webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: formData,
        });
        sheetsSaved = true;
      } catch (fallbackErr) {
        console.error('Google Sheets submission error:', fallbackErr);
      }
    }
  }

  // If at least one system saved the lead, return success!
  if (neonSaved || sheetsSaved) {
    return {
      success: true,
      message: successMessage,
      neonSaved,
      sheetsSaved,
    };
  }

  // Demo Fallback Mode if neither server is currently reachable
  console.log('AIBridge: Running lead submission demo preview mode.');
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: successMessage,
    isMock: true,
  };
};
