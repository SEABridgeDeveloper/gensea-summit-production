// ============================================================
// Google Apps Script — Form Submissions + Visit Tracking
// Same spreadsheet, two tabs: "Submissions" and "Visits"
// ============================================================

var SUBMISSIONS_SHEET = 'Submissions';
var VISITS_SHEET = 'Visits';

// ---------- Setup ----------

function initialSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Submissions tab
  var sub = ss.getSheetByName(SUBMISSIONS_SHEET);
  if (!sub) {
    sub = ss.insertSheet(SUBMISSIONS_SHEET);
    sub.appendRow([
      'Timestamp', 'Name', 'Organization', 'Position',
      'Phone', 'Email', 'Interest', 'Details', 'Source'
    ]);
    sub.getRange('1:1').setFontWeight('bold');
  }

  // Visits tab
  var vis = ss.getSheetByName(VISITS_SHEET);
  if (!vis) {
    vis = ss.insertSheet(VISITS_SHEET);
    vis.appendRow([
      'Timestamp', 'Visitor ID', 'Is New', 'Country', 'City', 'Page', 'Referrer', 'User Agent'
    ]);
    vis.getRange('1:1').setFontWeight('bold');
  }

  Logger.log('Setup complete.');
}

// ---------- GET handler ----------

function doGet(e) {
  var action = (e.parameter.action || '').toLowerCase();

  if (action === 'health') {
    return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
  }

  if (action === 'stats') {
    var secret = e.parameter.secret || '';
    var expected = PropertiesService.getScriptProperties().getProperty('ADMIN_SECRET');
    if (!expected || secret !== expected) {
      return jsonResponse({ status: 'error', message: 'Unauthorized' }, 403);
    }
    return jsonResponse(getVisitStats());
  }

  if (action === 'submissions') {
    var secret = e.parameter.secret || '';
    var expected = PropertiesService.getScriptProperties().getProperty('ADMIN_SECRET');
    if (!expected || secret !== expected) {
      return jsonResponse({ status: 'error', message: 'Unauthorized' }, 403);
    }
    return jsonResponse(getAllSubmissions());
  }

  return jsonResponse({ status: 'ok', message: 'Gen SEA Summit 2026 API' });
}

// ---------- POST handler ----------

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = (data.action || 'submit').toLowerCase();

    if (action === 'visit') {
      return handleVisit(data);
    }

    // Default: form submission
    return handleSubmission(data);

  } catch (err) {
    Logger.log('POST error: ' + err.message);
    return jsonResponse({ status: 'error', message: 'Invalid request' }, 400);
  }
}

// ---------- Visit tracking ----------

function handleVisit(data) {
  var visitorId = sanitize(data.visitorId || '', 64);
  if (!visitorId) {
    return jsonResponse({ status: 'error', message: 'Missing visitorId' }, 400);
  }

  var sheet = getOrCreateSheet(VISITS_SHEET, [
    'Timestamp', 'Visitor ID', 'Is New', 'Country', 'City', 'Page', 'Referrer', 'User Agent'
  ]);

  // Check if this visitor has been seen before
  var existingIds = sheet.getRange('B2:B' + Math.max(sheet.getLastRow(), 2)).getValues();
  var isNew = true;
  for (var i = 0; i < existingIds.length; i++) {
    if (existingIds[i][0] === visitorId) {
      isNew = false;
      break;
    }
  }

  sheet.appendRow([
    new Date(),
    visitorId,
    isNew,
    sanitize(data.country || '-', 64),
    sanitize(data.city || '-', 64),
    sanitize(data.page || '/', 256),
    sanitize(data.referrer || '-', 512),
    sanitize(data.userAgent || '-', 512)
  ]);

  return jsonResponse({ status: 'ok', isNew: isNew });
}

// ---------- Form submission ----------

function handleSubmission(data) {
  // Validate required fields
  var required = ['name', 'organization', 'email', 'phone', 'interest'];
  for (var i = 0; i < required.length; i++) {
    if (!data[required[i]] || !data[required[i]].toString().trim()) {
      return jsonResponse({ status: 'error', message: 'Missing: ' + required[i] }, 400);
    }
  }

  // Validate email format
  var email = data.email.toString().trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ status: 'error', message: 'Invalid email' }, 400);
  }

  // Validate interest value
  var validInterests = [
    'talent recruitment', 'brand exposure', 'partnership',
    'showcase', 'networking', 'speaking', 'other'
  ];
  var interest = data.interest.toString().trim();
  if (validInterests.indexOf(interest.toLowerCase()) === -1) {
    return jsonResponse({ status: 'error', message: 'Invalid interest' }, 400);
  }

  var sheet = getOrCreateSheet(SUBMISSIONS_SHEET, [
    'Timestamp', 'Name', 'Organization', 'Position',
    'Phone', 'Email', 'Interest', 'Details', 'Source'
  ]);

  // Duplicate check: same email within 1 minute
  var rows = sheet.getDataRange().getValues();
  var now = new Date();
  for (var i = rows.length - 1; i >= 1; i--) {
    if (rows[i][5] === email) {
      var ts = new Date(rows[i][0]);
      if ((now - ts) < 60000) {
        return jsonResponse({ status: 'error', message: 'Duplicate submission' }, 409);
      }
      break;
    }
  }

  sheet.appendRow([
    now,
    sanitize(data.name, 128),
    sanitize(data.organization, 128),
    sanitize(data.position || '', 128),
    sanitize(data.phone, 32),
    email,
    interest,
    sanitize(data.details || '', 1024),
    sanitize(data.source || 'website', 32)
  ]);

  // Optional email notification
  var notifyEmail = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (notifyEmail) {
    MailApp.sendEmail(
      notifyEmail,
      'New SEA Summit Interest: ' + data.name,
      'Name: ' + data.name + '\nOrg: ' + data.organization + '\nEmail: ' + email + '\nInterest: ' + interest
    );
  }

  return jsonResponse({ status: 'ok' });
}

// ---------- Stats ----------

function getVisitStats() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(VISITS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) {
    return { totalVisits: 0, uniqueVisitors: 0 };
  }

  var data = sheet.getRange('B2:C' + sheet.getLastRow()).getValues();
  var unique = {};
  var total = data.length;
  for (var i = 0; i < data.length; i++) {
    if (data[i][0]) unique[data[i][0]] = true;
  }

  return {
    totalVisits: total,
    uniqueVisitors: Object.keys(unique).length
  };
}

function getAllSubmissions() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SUBMISSIONS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var results = [];
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    results.push(row);
  }
  return results;
}

// ---------- Helpers ----------

function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange('1:1').setFontWeight('bold');
  }
  return sheet;
}

function sanitize(val, maxLen) {
  if (!val) return '';
  return val.toString().trim().substring(0, maxLen || 256);
}

function jsonResponse(data, code) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
