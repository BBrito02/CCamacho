# Publishing the new site on Amen

A step-by-step guide to replacing the current site on carolinacamacho.pt (hosted on Amen) with this new version.

The new site is plain HTML, CSS, JavaScript and images, so nothing needs installing on the server. You only swap the files. Allow about 30–45 minutes the first time.

---

> ## ⚠️ Before anything else: the notification email
>
> In the repository, `google-sheets/Codigo.gs` contains a **placeholder** instead of a real email:
>
> ```js
> var EMAIL_AVISO = 'COLOQUE_AQUI_O_EMAIL';
> ```
>
> The script **currently running** in Google still has your personal email, because it was set before the placeholder went in. So for now the request emails come to **you**, not to him.
>
> Before going live, put the **correct email** (the one that should receive the requests) in the code **inside Google's Apps Script editor**. See Step 1.
> **Never put the real email in the repository file.** The GitHub copy is public.

---

## What you need

- **Login for Amen's client area** (amen.pt → *Área de Cliente*), or the site's **FTP details** (server, username, password).
- **His Google account**, if the form requests should go to his account rather than yours (recommended).
- Optional: **FileZilla** (free, filezilla-project.org) if you'd rather upload by FTP than through the browser.

---

## Step 1: Point the forms to the right email and account

Do this **before** uploading, because it can change `assets/main.js`.

### Option A (recommended): move everything to his Google account
This way the spreadsheet with client data and the emails both live in his account.

1. Signed in to **his** Google account, follow the full installation in `google-sheets/COMO-CONFIGURAR.md` (steps 1 to 6).
2. At step 4 of that guide, after pasting the code, replace `COLOQUE_AQUI_O_EMAIL` with **his email**, keeping the quotes:
   ```js
   var EMAIL_AVISO = 'his.email@example.com';
   ```
3. Click **Save**, run **configurar**, then deploy as a Web App.
4. Copy the new **Web App URL** (the one ending in `/exec`).
5. Open `assets/main.js` and replace the address at the top with the new one:
   ```js
   var FORM_ENDPOINT = 'https://script.google.com/macros/s/....../exec';
   ```
   This file holds no secrets, so it's fine to commit it.
6. In **your** account, archive the old deployment (*Implementar → Gerir implementações → Arquivar*) and delete the test spreadsheet. That way no client data stays with you.

### Option B: keep it in your account and only change the email
1. In your Google account, open the spreadsheet → **Extensões → Apps Script**.
2. Change the email in `EMAIL_AVISO` to the correct address and click **Save**.
3. **Implementar → Gerir implementações** → pencil icon → **Versão: Nova versão** → **Implementar**.
   The URL stays the same, so `main.js` doesn't need to change.

> Whichever option you choose: if you ever copy the code from the repository into Google again, it comes back with `COLOQUE_AQUI_O_EMAIL`. Put the real email back before saving.

---

## Step 2: Prepare the files to upload

Make a folder on your computer (e.g. `site-upload`) and copy **only** these items into it:

| Upload | What it is |
|---|---|
| `index.html` | Home page |
| `sobre_nos.html` | About us |
| `servicos.html` | Services |
| `sinistros.html` | Claims |
| `simulacao.html` | Quote form |
| `contactos.html` | Contact page and form |
| `assets/` (whole folder) | Styles and scripts |
| `imgs/` (whole folder) | Logos and images |
| `pdf/` (whole folder) | Downloadable PDF |

**Do NOT upload:**

| Don't upload | Why |
|---|---|
| `google-sheets/` | The script lives in Google, not on the website |
| `.git/` | Hidden git history, which anyone could download |
| `README.md`, `LEIA-ME.txt`, `PUBLICAR-NO-AMEN.md` | Internal notes |

Keep the folder structure exactly as it is (`assets/style.css`, `imgs/logo-....png`, …). The server is case-sensitive, so don't rename anything.

---

## Step 3: Get into the hosting

1. Go to **amen.pt** → **Área de Cliente** and sign in.
2. Open the **hosting** product for carolinacamacho.pt and enter its control panel.
3. Find either:
   - the **File Manager** (*Gestor de Ficheiros*), or
   - the **FTP details** (*Acesso FTP*): server, username and password. You can reset the FTP password there if nobody knows it.
4. Find the site's folder. It's usually called **`public_html`**, **`www`** or **`httpdocs`**. It's the one that contains the current `index.html` or `index.php`.

> If you use FileZilla: **File → Site Manager → New site**. Enter the server, choose protocol **SFTP** if Amen offers it (otherwise FTP with *explicit TLS*), then enter the username and password and click **Connect**.

---

## Step 4: Back up the current site

Before changing anything:

1. Select **everything** inside the site folder.
2. Download it to your computer (File Manager: *Compress* → download the `.zip`; FileZilla: drag it to a local folder).
3. Store the backup somewhere safe, named e.g. `carolinacamacho-backup-YYYY-MM-DD`.

If anything goes wrong, uploading this backup restores the old site exactly.

---

## Step 5: Clear out the old site

On the server, inside the site folder, create a folder called `_old` and **move** the old site files into it. Moving is reversible; deleting isn't.

**Leave these alone** if they exist:
- `.well-known/`: used for the HTTPS certificate
- `cgi-bin/`: system folder
- `.htaccess`: often holds the redirect to `https://`. Open it first. If it has lines mentioning **WordPress** (`# BEGIN WordPress`), move it to `_old` too. If it only has the HTTPS redirect, keep it.

**Important:** if there's an **`index.php`** (old WordPress or PHP site), it **must** go into `_old`. Otherwise the server keeps showing the old homepage instead of the new `index.html`.

---

## Step 6: Upload the new site

- **File Manager:** open the site folder and upload the files from `site-upload`. To upload folders, it's often easier to compress `site-upload` into a `.zip`, upload it and use **Extract**. Make sure the files end up directly in the site folder, not inside a `site-upload/` subfolder.
- **FileZilla:** drag the **contents** of `site-upload` (not the folder itself) into the site folder on the right.

The site folder should end up looking like this:

```
public_html/
├── index.html
├── sobre_nos.html
├── servicos.html
├── sinistros.html
├── simulacao.html
├── contactos.html
├── assets/
├── imgs/
├── pdf/
└── _old/        ← old site, kept for safety
```

---

## Step 7: Test the live site

Open the site in a **private/incognito window** so you don't see a cached old version, and check:

- [ ] `https://carolinacamacho.pt` shows the new homepage, with the padlock (HTTPS)
- [ ] All six pages open from the menu, with no "page not found"
- [ ] Logos and images appear, and the layout looks right (if it looks unstyled, the `assets/` folder is in the wrong place)
- [ ] The menu opens and closes on a phone
- [ ] The PDF link works
- [ ] The **Instagram**, **Facebook** and **Google Maps** links in the footer work
- [ ] **Quote form:** send a test request with your own email:
  - a new row appears in the **Simulações** sheet
  - the notification email arrives at the **correct** address (the one from Step 1)
  - the automatic reply with the logo arrives in the "client" inbox
- [ ] **Contact form:** same test, which should land in the **Contactos** sheet
- [ ] Delete the test rows from the spreadsheet afterwards

---

## Step 8: Clean up (a week or two later)

Once you're sure everything works:
- delete the `_old/` folder from the server (keep your local backup from Step 4)
- in Google Search Console, if he uses it, check for broken links from the old page names

---

## Troubleshooting

| Problem | Likely cause / fix |
|---|---|
| The old homepage still appears | An old `index.php` is still in the site folder, so move it to `_old`. Or it's your browser cache, so try incognito. |
| Page has no styling / no images | `assets/` or `imgs/` aren't directly next to the `.html` files, or a file name's capitalization changed. |
| The form says it couldn't send | The URL in `assets/main.js` is wrong or the deployment is archived. Check the URL ends in `/exec` and the access is *Qualquer pessoa*. |
| The form works but no email arrives | `EMAIL_AVISO` still has `COLOQUE_AQUI_O_EMAIL` or a typo. Fix it in Google's editor and publish a **Nova versão**. Also check spam. |
| Old Google results lead to "page not found" | The old site used different page names. A redirect can be added in `.htaccess`, using the list of old page names. |
| The site shows "Not secure" | The SSL certificate isn't active. Enable it (often *Let's Encrypt*) in the Amen panel, and keep `.well-known/`. |

---

## Updating the site later

- Change files locally, test, then upload **only the changed files** over the old ones.
- If you change `assets/style.css` or `assets/main.js`, bump the number in the `?v=` at the end of their links in **all six** HTML files (e.g. `style.css?v=8` → `style.css?v=9`). Otherwise visitors may keep seeing the old cached version.
- Changes to the Google script don't need any upload. Just publish a **Nova versão** in Google.
