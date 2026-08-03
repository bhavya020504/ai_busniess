# Google Sheets Integration Guide - AIBridge Enterprise AI Discovery Platform

Follow this quick step-by-step guide to connect your AIBridge lead form directly to a Google Sheet.

---

## Step 1: Create a Google Sheet

1. Go to [sheets.new](https://sheets.new) in your web browser.
2. Name your spreadsheet **"AIBridge Consultations"** (or any name you prefer).
3. The column headers will be automatically added on the first form submission, or you can manually set row 1:
   - **Column A**: `Timestamp`
   - **Column B**: `Company Name`
   - **Column C**: `Contact Person`
   - **Column D**: `Business Email`
   - **Column E**: `Phone Number`
   - **Column F**: `Industry`

---

## Step 2: Add Google Apps Script

1. In your Google Sheet, click on **Extensions** > **Apps Script** in the top menu bar.
2. Delete any default code in the script editor (`Code.gs`).
3. Copy and paste the script below into `Code.gs`:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create column headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Company Name",
        "Contact Person",
        "Business Email",
        "Phone Number",
        "Industry"
      ]);
      
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1e293b");
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
    
    sheet.appendRow([
      timestamp,
      companyName,
      contactPerson,
      businessEmail,
      phoneNumber,
      industry
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        result: "success",
        status: 200,
        message: "Thank you! Your request has been received. Our AI Consultant will contact you shortly."
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
```

4. Click the **Save** icon (diskette icon) or press `Ctrl + S`.

---

## Step 3: Deploy as Web App

1. Click the blue **Deploy** button at top right, then select **New deployment**.
2. Click the gear icon next to *Select type* and choose **Web app**.
3. Fill out deployment configuration:
   - **Description**: `AIBridge Web App Lead Collector`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: **`Anyone`** *(Crucial step so public submissions can reach the script without login)*
4. Click **Deploy**.
5. Google will ask to **Authorize access**. Click *Authorize access*, select your Google Account, click *Advanced* > *Go to Untitled project (unsafe)* (standard Google Apps Script warning), and click **Allow**.
6. Copy the **Web App URL** generated (it ends with `/exec`).

---

## Step 4: Paste Web App URL in AIBridge Application

You have two easy options to configure the URL in the website:

### Option A: In the Website UI
1. Open the AIBridge website.
2. Click the **"Google Sheets Config"** button in the header or footer.
3. Paste your Web App URL into the input field and click **Save Settings**.
4. Test a form submission!

### Option B: In the Environment / Source Code
1. Open `src/config/api.ts` in your codebase.
2. Set `DEFAULT_WEB_APP_URL` to your Web App URL.
3. Or add an `.env` file with `VITE_GOOGLE_APPS_SCRIPT_URL=your_web_app_url`.

---

## Testing & Verification

1. Submit a test lead through the AIBridge lead form.
2. Open your Google Sheet — a new row will instantly appear with:
   - `Timestamp`
   - `Company Name`
   - `Contact Person`
   - `Business Email`
   - `Phone Number`
   - `Industry`
