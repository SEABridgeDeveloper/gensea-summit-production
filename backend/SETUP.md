# Backend Setup Guide — Gen SEA Summit 2026

Google Sheets + Google Apps Script backend for the interest form.

---

## Architecture Overview

```
[Website Form]  --POST JSON-->  [Google Apps Script]  --appendRow-->  [Google Sheet]
                                       |
                                       +-- (optional) Email notification
```

- **Database**: Google Sheets (1 sheet tab called `Submissions`)
- **API**: Google Apps Script deployed as Web App
- **Auth**: Public POST (form submissions), Secret-protected GET (admin read)

---

## Schema (Google Sheet Columns)

| Column       | Type     | Required | Description                          |
|-------------|----------|----------|--------------------------------------|
| Timestamp   | DateTime | Auto     | ISO 8601 timestamp of submission     |
| Name        | String   | Yes      | Full name (max 200 chars)            |
| Organization| String   | Yes      | Company or institution (max 200)     |
| Position    | String   | No       | Role / job title (max 200)           |
| Phone       | String   | Yes      | Phone number (max 50)                |
| Email       | String   | Yes      | Email address, validated (max 200)   |
| Interest    | Enum     | Yes      | One of the predefined options below  |
| Details     | String   | No       | Free-text details (max 2000)         |
| Source      | String   | Auto     | Where the submission came from       |

**Interest options**: `Talent Recruitment`, `Brand Exposure`, `Partnership`, `Showcase`, `Networking`, `Speaking`, `Other`

---

## Step-by-Step Setup

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Rename it to: `Gen SEA Summit 2026 — Submissions`
4. **Do NOT manually create headers** — the script does this automatically

### Step 2: Open Apps Script Editor

1. In the Google Sheet, go to **Extensions > Apps Script**
2. This opens the Apps Script editor in a new tab
3. Delete any default code in the editor (the default `myFunction`)

### Step 3: Paste the Backend Code

1. Open the file `backend/Code.gs` from this repository
2. Copy the **entire content** of `Code.gs`
3. Paste it into the Apps Script editor (replacing everything)
4. Click the save icon (or `Ctrl+S` / `Cmd+S`)
5. The project name will appear as "Untitled project" — rename it to `GenSEA Backend`

### Step 4: Run Initial Setup

1. In the Apps Script editor, select `initialSetup` from the function dropdown (top toolbar)
2. Click the **Run** button (play icon)
3. Google will ask for authorization — click **Review Permissions**
4. Choose your Google account
5. You may see "Google hasn't verified this app" — click **Advanced > Go to GenSEA Backend (unsafe)**
6. Click **Allow** to grant permissions
7. Check the **Execution log** at the bottom — it should say `Setup complete`
8. Go back to your Google Sheet — you should see a `Submissions` tab with headers

### Step 5: Configure Properties (Important!)

1. In Apps Script editor, go to **Project Settings** (gear icon in left sidebar)
2. Scroll down to **Script Properties**
3. Edit the `ADMIN_SECRET` property — change it to a **random string** (e.g., generate one at [randomstring.dev](https://randomstring.dev))
4. (Optional) Add a `NOTIFY_EMAIL` property with your email to receive notifications for each submission

### Step 6: Deploy as Web App

1. Click **Deploy > New deployment** (top right)
2. Click the gear icon next to "Select type" and choose **Web app**
3. Fill in:
   - **Description**: `Gen SEA Summit v1`
   - **Execute as**: `Me` (your account)
   - **Who has access**: `Anyone` (this allows the public form to submit)
4. Click **Deploy**
5. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
6. Save this URL — you will need it in the next step

### Step 7: Connect the Website

**Option A: Environment Variable (recommended)**

1. In the project root, create a `.env.local` file:
   ```
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```
2. Replace `YOUR_DEPLOYMENT_ID` with the actual deployment URL from Step 6
3. Rebuild the site: `npm run build`

**Option B: Direct Edit**

1. Open `src/components/InterestForm.tsx`
2. Replace the URL in the fallback:
   ```typescript
   const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'
   ```

### Step 8: Test the Form

1. Run `npm run dev` and open the site
2. Fill out the form and submit
3. Check the Google Sheet — a new row should appear in the `Submissions` tab
4. If you set `NOTIFY_EMAIL`, check your inbox for the notification

---

## API Reference

### POST (Form Submission)

```bash
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "organization": "Acme Inc",
    "position": "CTO",
    "phone": "+66 812 345 678",
    "email": "john@acme.com",
    "interest": "Partnership",
    "details": "Interested in sponsoring",
    "source": "website"
  }'
```

**Response (success)**:
```json
{ "status": "ok", "message": "Submission received successfully" }
```

**Response (validation error)**:
```json
{ "status": "error", "message": "Validation failed", "errors": ["valid email is required"] }
```

**Response (duplicate)**:
```json
{ "status": "error", "message": "Duplicate submission. Please wait before submitting again." }
```

### GET (Health Check)

```
GET YOUR_WEB_APP_URL?action=health
```

### GET (Read Submissions — Admin Only)

```
GET YOUR_WEB_APP_URL?action=submissions&secret=YOUR_ADMIN_SECRET
```

---

## Updating the Script After Deployment

When you edit `Code.gs` and want to push changes:

1. Edit the code in Apps Script editor
2. Go to **Deploy > Manage deployments**
3. Click the **pencil icon** on the active deployment
4. Change **Version** to `New version`
5. Click **Deploy**

> The URL stays the same — no need to update the website.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Form submits but no data in Sheet | Check the `Submissions` tab exists. Run `initialSetup` again |
| "TypeError: Cannot read properties" | Make sure the POST body is valid JSON |
| CORS errors in browser console | Google Apps Script handles CORS automatically when deployed as Web App with "Anyone" access. Make sure you're NOT using `mode: 'no-cors'` in fetch |
| "Google hasn't verified this app" | Click Advanced > Go to ... (unsafe). This is normal for personal scripts |
| Email notifications not sending | Check `NOTIFY_EMAIL` is set in Script Properties. Google has a daily email quota (~100/day for free accounts) |
| Duplicate submissions blocked | The script blocks same-email submissions within 1 minute. Wait and try again |
