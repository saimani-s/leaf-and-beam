# Leaf & Beam Website

This is a simple, fast, and beautiful website for a construction and interior design company. It is built using only HTML, CSS, and JavaScript.

## What we did to make this website:
1. **Designed the Pages:** We created a home page, about section, services list, and a contact form.
2. **Made it Mobile Friendly:** We added a menu that works on phones and made sure the layout adjusts to any screen size.
3. **Optimized for Speed:** We made sure the code is clean so the website loads instantly.
4. **Connected a Contact Form:** When someone fills out the contact form on the website, their details are automatically saved directly into a private Google Sheet.
5. **Hosted on GitHub:** The website is stored and hosted on GitHub for free!

---

## How to change the Google Sheet (If you give this website to someone else)

If someone else takes over this website, they will want the contact form to send data to *their* Google Sheet, not yours. 

Here are the very simple steps they need to follow:

### 1. Create a new Google Sheet
- Tell them to open Google Sheets and create a new blank spreadsheet.
- In the very first row (boxes A1 to E1), they must type exactly these 5 words (all lowercase):
  - `name`
  - `phone`
  - `location`
  - `projectType`
  - `message`

### 2. Add the Magic Code
- Tell them to click on **Extensions** > **Apps Script** at the top of the Google Sheet.
- Delete any code that is there, and paste this magic code instead:

```javascript
var sheetName = 'Sheet1';
var scriptProp = PropertiesService.getScriptProperties();

function initialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost (e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    var sheet = doc.getSheetByName(sheetName);

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    var newRow = headers.map(function(header) {
      return e.parameter[header];
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

### 3. Deploy and Get the Link
- Tell them to click the **Save** icon at the top.
- Next to the "Run" button, make sure `initialSetup` is selected and click **Run**. (They will have to click 'Review Permissions' and allow it to run).
- Finally, click the blue **Deploy** button in the top right, select **New deployment**.
- Click the gear ⚙️ icon, select **Web app**.
- Change "Who has access" to **Anyone** and click **Deploy**.
- They will be given a long **Web app URL**. They need to copy this link!

### 4. Connect it to the Website
- Open the `script.js` file in the website folder.
- Go to line 35. You will see a long link that looks like `https://script.google.com/...`.
- Delete that old link, and paste their new **Web app URL** inside the quote marks.
- Save the file and upload the new version to GitHub. That's it!
