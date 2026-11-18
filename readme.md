# TechMated Solutions — Website

A fast, responsive, single-page marketing site. Static HTML/CSS/JS — **no build step, no framework**. Built with your logo, your slate brand color (`#344D62`), a teal button accent (`#0C6E7D`), and the self-hosted **Nunito** font.

---

## 1. What's in here

```
index.html                 ← the whole page (all content/copy lives here)
netlify.toml               ← Netlify config (headers, caching)
assets/
  css/styles.css           ← all styling + brand color tokens (top of file)
  css/fonts.css            ← @font-face for Nunito
  js/main.js               ← mobile nav, scroll reveals, contact form handler
  fonts/*.woff2            ← Nunito (self-hosted, no Google Fonts dependency)
  img/logo.png             ← full-color logo (header)
  img/logo-white.png       ← white logo (dark footer)
  img/favicon.svg          ← browser-tab icon
  img/apple-touch-icon.png ← icon for iOS home screen
```

To edit any wording, open **`index.html`** and type over the text — it reads top to bottom in the same order as the page.

---

## 2. Deploy to Netlify

**Option A — drag & drop (fastest)**
1. Go to <https://app.netlify.com/drop>.
2. Drag this entire folder onto the page.
3. Netlify gives you a live `*.netlify.app` URL in seconds.

**Option B — connect a Git repo (best for ongoing edits)**
1. Push this folder to a GitHub/GitLab repo.
2. In Netlify: *Add new site → Import an existing project* → pick the repo.
3. Build command: *(leave empty)* · Publish directory: `.`
4. Every push auto-deploys.

### Point your domain
1. In your Netlify site: **Domain management → Add a domain** → enter your domain (e.g. `techmated.com`).
2. Netlify shows the DNS records to set. Either:
   - **Use Netlify DNS** (easiest): change your domain's nameservers at your registrar to the ones Netlify lists, **or**
   - **Keep your current DNS**: add the `A` / `CNAME` records Netlify shows.
3. HTTPS is automatic (free Let's Encrypt certificate) once DNS resolves.

---

## 3. The contact form → your Google Sheet + email

When someone clicks **Send message**, the form is submitted silently in the background (the visitor's email app does **not** open) and they see a success message on the page. Every submission flows to a **Google Apps Script**, which **saves it to your Google Sheet** and **emails it to tj@techmated.com**. One-time setup:

1. Create a Google Sheet. Add a header row: `timestamp | name | organization | email | message`.
2. In the Sheet: **Extensions → Apps Script**, delete any sample code, and paste this:

   ```javascript
   function doPost(e) {
     const p = e.parameter;
     // 1) save the submission to the sheet
     SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
       .appendRow([new Date(), p.name || '', p.organization || '', p.email || '', p.message || '']);
     // 2) email it to you
     MailApp.sendEmail({
       to: 'tj@techmated.com',
       subject: 'New inquiry from ' + (p.name || 'website') + (p.organization ? ' · ' + p.organization : ''),
       replyTo: p.email || '',
       body: 'Name: ' + (p.name || '') + '\nOrganization: ' + (p.organization || '') +
             '\nEmail: ' + (p.email || '') + '\n\n' + (p.message || '')
     });
     return ContentService.createTextOutput('ok');
   }
   ```

3. **Deploy → New deployment → Web app.** Set *Execute as: Me* and *Who has access: **Anyone***. Authorize when prompted. Copy the **Web App URL** (ends in `/exec`).
4. Open **`assets/js/main.js`** and paste that URL into the first line:

   ```javascript
   const SHEETS_ENDPOINT = "https://script.google.com/macros/s/XXXXXXXX/exec";
   ```

5. Redeploy the site. Done — submissions now land in your Sheet and your inbox, and the visitor sees the success message.

> Until you paste the URL in step 4, the form shows "This form isn't connected yet — please email tj@techmated.com directly." Local testing (opening `index.html` from your computer) won't send; it works once deployed to a real URL.

> **Changing your email later?** Update it in three places: the Apps Script above (`to:`), the `mailto:` link in `index.html` (search `tj@techmated.com`), and `CONTACT_EMAIL` in `assets/js/main.js`.

> *Alternative:* if you'd ever rather not use Google, Netlify has its own built-in form capture (add `data-netlify="true"` to the `<form>` and enable an email notification in the Netlify dashboard). Not needed for the setup above.

---

## 4. Swapping the logo or font later
- **Logo:** replace `assets/img/logo.png` (header) and `assets/img/logo-white.png` (footer) with same-named files.
- **Brand colors:** edit the tokens at the top of `assets/css/styles.css` (`:root { --slate … --accent … }`).
- **Font:** the Nunito weights live in `assets/fonts/`; `assets/css/fonts.css` maps them.

---

*Built on data. Driven by mission.*
