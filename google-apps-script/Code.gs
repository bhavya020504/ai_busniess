/**
 * AIBridge Enterprise Lead Discovery & Call Trigger Apps Script Backend
 * 
 * Features:
 * 1. Stores incoming form submissions directly into Google Sheets.
 * 2. Formats lead columns: Timestamp, Company Name, Contact Person, Business Email, Phone Number, Industry, Call Status, Lead ID.
 * 3. Sends an instant Email Notification to your team when a new lead is captured.
 * 4. (Optional) Triggers a Webhook for automated calling services (Twilio, Vapi, Bland.ai, Zapier, Make).
 */

// OPTIONAL: Set your notification email address here to get instant email alerts
var NOTIFICATION_EMAIL = "your-email@example.com"; 

// OPTIONAL: Set your automated calling webhook URL (Zapier, Make, Bland.ai, Vapi, Twilio)
var CALL_WEBHOOK_URL = ""; 

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create Header Row if sheet is empty
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
      
      // Format Header Row
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0f172a");
      headerRange.setFontColor("#ffffff");
    }
    
    // Parse incoming request payload
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
    
    // 1. Store lead in Google Sheet
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
    
    // 2. Trigger Email Alert to Sales/AI Consultant (if NOTIFICATION_EMAIL is configured)
    if (NOTIFICATION_EMAIL && NOTIFICATION_EMAIL !== "your-email@example.com") {
      try {
        MailApp.sendEmail({
          to: NOTIFICATION_EMAIL,
          subject: "🔥 NEW LEAD: " + companyName + " - " + contactPerson + " (" + industry + ")",
          htmlBody: `
            <h2>New AI Consultation Request</h2>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Contact Person:</strong> ${contactPerson}</p>
            <p><strong>Business Email:</strong> ${businessEmail}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Industry:</strong> ${industry}</p>
            <p><strong>Lead ID:</strong> ${leadId}</p>
            <p><strong>Submitted At:</strong> ${timestamp}</p>
            <hr />
            <p><em>Action Required: Call lead or trigger automated calling workflow.</em></p>
          `
        });
      } catch (emailErr) {
        Logger.log("Email notification error: " + emailErr.toString());
      }
    }
    
    // 3. Trigger Automated Call Webhook (Optional: Bland.ai / Vapi / Twilio / Zapier)
    if (CALL_WEBHOOK_URL && CALL_WEBHOOK_URL.length > 5) {
      try {
        UrlFetchApp.fetch(CALL_WEBHOOK_URL, {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify({
            leadId: leadId,
            companyName: companyName,
            contactPerson: contactPerson,
            businessEmail: businessEmail,
            phoneNumber: phoneNumber,
            industry: industry,
            timestamp: timestamp
          })
        });
      } catch (webhookErr) {
        Logger.log("Call Webhook error: " + webhookErr.toString());
      }
    }
    
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
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      service: "AIBridge Lead Capture & Call Trigger Endpoint",
      message: "Send POST requests with lead data to capture leads and trigger automated calls."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
