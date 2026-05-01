# How to Connect Your Form to Google Sheets (Excel)

To get form submissions directly into a spreadsheet, the easiest and free method is using **Google Sheets** and **Google Apps Script**. You can always download a Google Sheet as an Excel file (`.xlsx`) at any time.

Follow these simple steps to set it up:

### Step 1: Create a New Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it something like **"Leaf & Beam Leads"**.
3. In the first row, add the following headers (these must match exactly):
   - Cell A1: `name`
   - Cell B1: `phone`
   - Cell C1: `location`
   - Cell D1: `projectType`
   - Cell E1: `message`

### Step 2: Add Google Apps Script
1. In your Google Sheet, click on **Extensions** in the top menu, then click **Apps Script**.
2. Delete any code in the editor and paste the following code:

```javascript
const sheetName = 'Sheet1'; // Change this if your sheet tab has a different name
const scriptProp = PropertiesService.getScriptProperties();

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost (e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    const newRow = headers.map(function(header) {
      return header === 'timestamp' ? new Date() : e.parameter[header];
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  finally {
    lock.releaseLock();
  }
}
```

### Step 3: Run the Initial Setup
1. Above the code editor, click the **Save** icon (the floppy disk).
2. Select the `initialSetup` function from the dropdown next to the "Run" button.
3. Click **Run**.
4. A prompt will appear asking for permissions. Click **Review permissions**, select your account, click **Advanced**, and then click **Go to [Project Name] (unsafe)**. Finally, click **Allow**.

### Step 4: Deploy the Script as a Web App
1. In the top right corner of the Apps Script editor, click the blue **Deploy** button, then select **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Fill out the details:
   - **Description**: Leaf and Beam Form
   - **Execute as**: Me
   - **Who has access**: Anyone (This is critical so the website can send data to it)
4. Click **Deploy**.
5. Copy the **Web app URL** that is provided.

### Step 5: Update Your Website Code
1. Open the `script.js` file in your code editor.
2. Find the line that looks like this (around line 22):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE'` with the Web app URL you copied in Step 4. Keep the single quotes around the URL!
4. Save the file.

Now, whenever someone submits the form on your website, the details will instantly appear as a new row in your Google Sheet!
