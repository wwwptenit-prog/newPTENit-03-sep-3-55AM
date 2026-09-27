========================================================================
             PTENit & Order Boss — cPanel Deployment Guide
========================================================================

✅ 100% PRODUCTION READY FOR CPANEL (NO NODE.JS REQUIRED)
✅ FIREBASE FIRESTORE & AUTH CONNECT DIRECTLY FROM BROWSER VIA SSL/HTTPS
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
   - README_CPANEL_INSTRUCTIONS.txt
7. (Optional) You can delete the uploaded ZIP file to save disk space.
8. Visit your website domain in any web browser!

------------------------------------------------------------------------
FAQ & TROUBLESHOOTING
------------------------------------------------------------------------

Q1: Does this require Node.js or PM2 on cPanel?
A: No! This is a pre-compiled, optimized static Single Page Application (SPA).
   Apache handles serving the static files, while Firebase handles real-time
   database, user accounts, and authentication directly from the browser.

Q2: What if internal pages/links show 404 when refreshed?
A: Ensure the hidden ".htaccess" file was extracted into public_html.
   In cPanel File Manager, click "Settings" (top right) and check
   "Show Hidden Files (dotfiles)" to verify .htaccess is present.

Q3: Is Firebase configured?
A: Yes! Firebase Firestore and Authentication configurations are compiled
   into the assets bundle and will automatically sync live in real-time.

------------------------------------------------------------------------
Need Support? Contact PTENit IT Support & Customer Care.
========================================================================
