========================================================================
             PTENit & Order Boss — cPanel Deployment Guide
========================================================================

✅ 100% PRODUCTION READY FOR CPANEL (NO NODE.JS REQUIRED)
✅ DUAL SERVER STORAGE:
   1. cPanel Server Storage Engine (api/sync.php -> server_data/*.json)
   2. Google Firebase Cloud Real-time Database (Firestore & Auth)
✅ APACHE .HTACCESS PRE-CONFIGURED FOR SPA REWRITING, GZIP & CACHING

------------------------------------------------------------------------
STEP-BY-STEP INSTALLATION INSTRUCTIONS (cPanel / Apache)
------------------------------------------------------------------------

1. Log in to your cPanel Dashboard.
2. Open "File Manager" and navigate to your domain root:
   - For primary domain: go into the "public_html" folder.
   - For an addon domain or subdomain: go into that domain's root folder.
3. Click "Upload" at the top menu bar.
4. Upload this ZIP file ("PTENit.zip").
5. Once uploaded, right-click the ZIP file and select "Extract" (Extract Files into public_html).
6. After extraction, ensure the following files and folders sit directly in your public_html:
   - index.html
   - .htaccess
   - manifest.json
   - assets/ (contains all optimized JavaScript & CSS bundles)
   - api/ (contains sync.php server data engine)
   - server_data/ (contains live JSON databases: orders.json, users.json, etc.)
   - README_CPANEL_INSTRUCTIONS.txt
7. Permissions Check: Ensure the "server_data" folder has write permissions (755 or 777 in cPanel).
8. Visit your website domain in any web browser (desktop or mobile phone)!

------------------------------------------------------------------------
DATA STORAGE EXPLANATION (How Data is Saved)
------------------------------------------------------------------------

When you or any user (from phone or PC) places an order, registers, or saves settings:
1. Data is instantly saved on your cPanel server inside "public_html/server_data/*.json"
   (e.g., orders.json, users.json, marketplaceOrders.json, siteSettings.json).
2. Data is simultaneously synced with Google Cloud Firebase Firestore for real-time
   live updates across devices.
3. Even without Node.js or PM2, standard cPanel Apache + PHP handles full data saving!

------------------------------------------------------------------------
FAQ & TROUBLESHOOTING
------------------------------------------------------------------------

Q1: Does this require Node.js or PM2 on cPanel?
A: No! Apache and PHP handle serving files and saving data into server_data/*.json.

Q2: What if internal pages/links show 404 when refreshed?
A: Ensure the hidden ".htaccess" file was extracted into public_html.
   In cPanel File Manager, click "Settings" (top right) and check
   "Show Hidden Files (dotfiles)" to verify .htaccess is present.

Q3: Why doesn't Google Sign-In work on my custom domain?
A: For Google Sign-In on a custom domain (e.g. yourdomain.com), go to
   Firebase Console -> Authentication -> Settings -> Authorized Domains
   and add your domain name. Email/Password, phone, and standard registration
   work everywhere without any extra setup.

------------------------------------------------------------------------
Need Support? Contact PTENit IT Support & Customer Care.
========================================================================
