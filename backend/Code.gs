// ============================================================
//  Gen SEA Summit 2026 — Google Apps Script Backend
//  This script receives form submissions and stores them
//  in the active Google Sheet.
// ============================================================

// ---------- CONFIG ----------
var CONFIG = {
  SHEET_NAME: 'Submissions',       // ชื่อ Sheet tab ที่จะเก็บข้อมูล
  HEADERS: [
    'Timestamp',
    'Name',
    'Organization',
    'Position',
    'Phone',
    'Email',
    'Interest',
    'Details',
    'Source'
  ],
  ALLOWED_INTERESTS: [
    'Talent Recruitment',
    'Brand Exposure',
    'Partnership',
    'Showcase',
    'Networking',
    'Speaking',
    'Other'
  ]
};

// ---------- CORS HELPER ----------
function createCorsResponse(data, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ---------- GET: Health check / Read submissions ----------
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'health';

  if (action === 'health') {
    return createCorsResponse({
      status: 'ok',
      message: 'Gen SEA Summit 2026 API is running',
      timestamp: new Date().toISOString()
    });
  }

  if (action === 'submissions') {
    var secret = (e && e.parameter && e.parameter.secret) || '';
    var props = PropertiesService.getScriptProperties();
    var adminSecret = props.getProperty('ADMIN_SECRET');

    if (!adminSecret || secret !== adminSecret) {
      return createCorsResponse({ status: 'error', message: 'Unauthorized' });
    }

    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = [];

    for (var i = 1; i < data.length; i++) {
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j];
      }
      rows.push(row);
    }

    return createCorsResponse({
      status: 'ok',
      count: rows.length,
      data: rows
    });
  }

  return createCorsResponse({ status: 'error', message: 'Unknown action' });
}

// ---------- POST: Receive form submission ----------
function doPost(e) {
  try {
    var body;
    if (e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else {
      return createCorsResponse({ status: 'error', message: 'No data received' });
    }

    // --- Validation ---
    var errors = [];

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      errors.push('name is required');
    }
    if (!body.organization || typeof body.organization !== 'string' || body.organization.trim().length === 0) {
      errors.push('organization is required');
    }
    if (!body.email || typeof body.email !== 'string' || !isValidEmail(body.email)) {
      errors.push('valid email is required');
    }
    if (!body.phone || typeof body.phone !== 'string' || body.phone.trim().length === 0) {
      errors.push('phone is required');
    }
    if (!body.interest || CONFIG.ALLOWED_INTERESTS.indexOf(body.interest) === -1) {
      errors.push('interest must be one of: ' + CONFIG.ALLOWED_INTERESTS.join(', '));
    }

    if (errors.length > 0) {
      return createCorsResponse({ status: 'error', message: 'Validation failed', errors: errors });
    }

    // --- Sanitize ---
    var sanitized = {
      timestamp: new Date().toISOString(),
      name: body.name.trim().substring(0, 200),
      organization: body.organization.trim().substring(0, 200),
      position: (body.position || '').trim().substring(0, 200),
      phone: body.phone.trim().substring(0, 50),
      email: body.email.trim().toLowerCase().substring(0, 200),
      interest: body.interest,
      details: (body.details || '').trim().substring(0, 2000),
      source: (body.source || 'website').trim().substring(0, 50)
    };

    // --- Duplicate check (same email within 1 minute) ---
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();
    var emailCol = CONFIG.HEADERS.indexOf('Email');
    var tsCol = CONFIG.HEADERS.indexOf('Timestamp');
    var now = new Date();

    for (var i = data.length - 1; i >= 1; i--) {
      if (data[i][emailCol] === sanitized.email) {
        var prevTime = new Date(data[i][tsCol]);
        if ((now - prevTime) < 60000) {
          return createCorsResponse({
            status: 'error',
            message: 'Duplicate submission. Please wait before submitting again.'
          });
        }
        break;
      }
    }

    // --- Write to sheet ---
    var row = CONFIG.HEADERS.map(function(header) {
      var key = header.toLowerCase();
      return sanitized[key] !== undefined ? sanitized[key] : '';
    });
    sheet.appendRow(row);

    // --- Optional: Send notification email ---
    sendNotificationEmail(sanitized);

    return createCorsResponse({
      status: 'ok',
      message: 'Submission received successfully'
    });

  } catch (err) {
    return createCorsResponse({
      status: 'error',
      message: 'Server error: ' + err.message
    });
  }
}

// ---------- HELPERS ----------

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    // Write headers
    sheet.getRange(1, 1, 1, CONFIG.HEADERS.length).setValues([CONFIG.HEADERS]);
    // Bold + freeze header row
    sheet.getRange(1, 1, 1, CONFIG.HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#f3f3f3');
    sheet.setFrozenRows(1);
    // Auto-resize columns
    for (var i = 1; i <= CONFIG.HEADERS.length; i++) {
      sheet.setColumnWidth(i, 150);
    }
  }

  return sheet;
}

function isValidEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function sendNotificationEmail(data) {
  var props = PropertiesService.getScriptProperties();
  var notifyEmail = props.getProperty('NOTIFY_EMAIL');

  if (!notifyEmail) return;

  try {
    var subject = '[Gen SEA Summit] New Interest: ' + data.name + ' (' + data.organization + ')';
    var body = 'New interest form submission:\n\n'
      + 'Name: ' + data.name + '\n'
      + 'Organization: ' + data.organization + '\n'
      + 'Position: ' + data.position + '\n'
      + 'Phone: ' + data.phone + '\n'
      + 'Email: ' + data.email + '\n'
      + 'Interest: ' + data.interest + '\n'
      + 'Details: ' + data.details + '\n'
      + 'Submitted: ' + data.timestamp + '\n';

    MailApp.sendEmail(notifyEmail, subject, body);
  } catch (err) {
    // Fail silently — don't block submission
    Logger.log('Email notification failed: ' + err.message);
  }
}

// ---------- INITIAL SETUP (run once) ----------
function initialSetup() {
  getOrCreateSheet();

  // Set admin secret for reading submissions (change this!)
  var props = PropertiesService.getScriptProperties();
  props.setProperty('ADMIN_SECRET', 'CHANGE_THIS_TO_A_RANDOM_STRING');

  // Optional: set notification email
  // props.setProperty('NOTIFY_EMAIL', 'your@email.com');

  Logger.log('Setup complete. Sheet and properties initialized.');
}
