#!/usr/bin/env python3
import os
import shutil
import subprocess
import zipfile
import sys
import json

def main():
    root = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    print(f"[*] Project root: {root}")
    dist_dir = os.path.join(root, 'dist')
    
    # 1. Verify build exists
    if not os.path.exists(os.path.join(dist_dir, 'index.html')):
        print("[!] dist/index.html not found, running npm run build...")
        res = subprocess.run(["npm", "run", "build"], cwd=root, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"[x] Build error: {res.stderr}\n{res.stdout}")
            sys.exit(1)
        print("[+] Build completed successfully!")

    # 2. Ensure dist has .htaccess
    src_htaccess = os.path.join(root, 'public', '.htaccess')
    dst_htaccess = os.path.join(dist_dir, '.htaccess')
    if os.path.exists(src_htaccess):
        shutil.copy2(src_htaccess, dst_htaccess)

    # 3. Ensure dist has api/sync.php
    src_api = os.path.join(root, 'public', 'api')
    dst_api = os.path.join(dist_dir, 'api')
    if os.path.exists(src_api):
        if os.path.exists(dst_api):
            shutil.rmtree(dst_api)
        shutil.copytree(src_api, dst_api)

    # 4. Ensure dist has server_data with all live collections
    src_server_data = os.path.join(root, 'public', 'server_data')
    dst_server_data = os.path.join(dist_dir, 'server_data')
    if os.path.exists(src_server_data):
        if os.path.exists(dst_server_data):
            shutil.rmtree(dst_server_data)
        shutil.copytree(src_server_data, dst_server_data)

    # 5. Create a standalone server.js in dist for Node.js hosts
    server_js_path = os.path.join(dist_dir, 'server.js')
    with open(server_js_path, 'w', encoding='utf-8') as f:
        f.write('''// PTENit Production Server for Node.js / cPanel Application Manager
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Server data sync endpoint for Node environments
app.all('/api/sync.php', (req, res) => {
  const dataDir = path.join(__dirname, 'server_data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const collection = (req.query.collection || (req.body && req.body.collection) || '').replace(/[^a-zA-Z0-9_-]/g, '');
  if (!collection) return res.json({ status: 'online', timestamp: new Date().toISOString() });

  const colFile = path.join(dataDir, `${collection}.json`);

  if (req.method === 'GET') {
    if (fs.existsSync(colFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(colFile, 'utf-8'));
        return res.json(data);
      } catch (e) {
        return res.json([]);
      }
    }
    return res.json([]);
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    const payload = req.body || {};
    const items = payload.items || (Array.isArray(payload) ? payload : null);
    if (items) {
      fs.writeFileSync(colFile, JSON.stringify(items, null, 2), 'utf-8');
      return res.json({ success: true, count: items.length });
    }
    const docData = payload.data || payload;
    let existing = [];
    if (fs.existsSync(colFile)) {
      try { existing = JSON.parse(fs.readFileSync(colFile, 'utf-8')) || []; } catch {}
    }
    const id = docData.id || `doc_${Date.now()}`;
    docData.id = id;
    const idx = existing.findIndex(x => x.id === id);
    if (idx >= 0) existing[idx] = { ...existing[idx], ...docData };
    else existing.unshift(docData);
    fs.writeFileSync(colFile, JSON.stringify(existing, null, 2), 'utf-8');
    return res.json({ success: true, docId: id });
  }

  res.status(405).json({ error: 'Method Not Allowed' });
});

// SPA Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`PTENit server running on port ${PORT}`);
});
''')

    # 6. Create production package.json in dist
    dist_pkg = os.path.join(dist_dir, 'package.json')
    with open(dist_pkg, 'w', encoding='utf-8') as f:
        json.dump({
            "name": "ptenit-live",
            "version": "2.0.0",
            "description": "PTENit & Marketplace Production Server",
            "main": "server.js",
            "scripts": {
                "start": "node server.js"
            },
            "dependencies": {
                "express": "^4.21.2"
            }
        }, f, indent=2)

    # 7. Write a detailed Bengali + English HOW_TO_USE.txt
    instruction_path = os.path.join(dist_dir, 'HOW_TO_RUN_THIS_WEBSITE.txt')
    with open(instruction_path, 'w', encoding='utf-8') as f:
        f.write('''================================================================================
          PTENit - সম্পূর্ণ ওয়েবসাইট প্যাকেজ ও ইনস্টলেশন গাইড
================================================================================

এই ZIP ফাইলের মধ্যে আপনার ওয়েবসাইটের প্রয়োজনীয় সকল ফাইল শতভাগ প্রস্তুত আছে:
১. index.html - মূল ওয়েবসাইট এন্ট্রি পয়েন্ট
২. assets/ - সমস্ত CSS, JS কোড ও ডিজাইনিং কম্পোনেন্ট
৩. api/sync.php - ডেটাবেজ সেভ ও রিয়েলটাইম সিনক্রোনাইজেশন ইঞ্জিন (PHP)
৪. server_data/ - কোর্স, গিগ, প্রোডাক্ট, সার্ভিস এবং ব্যবহারকারীদের লাইভ ডেটাবেজ
৫. .htaccess - cPanel Apache রিরাইট ও স্পিড অপ্টিমাইজেশন
৬. server.js & package.json - যদি cPanel Node.js App ব্যবহার করেন
৭. manifest.json - মোবাইল অ্যাপ (PWA) কনফিগারেশন

--------------------------------------------------------------------------------
পদ্ধতি ১: সাধারণ cPanel হোস্টিং (Apache + PHP) তে তোলার নিয়ম:
--------------------------------------------------------------------------------
১. cPanel-এ লগইন করুন এবং "File Manager"-এ যান।
২. আপনার ডোমেইনের ফোল্ডারে প্রবেশ করুন (যেমন public_html অথবা ptenit.binnibazar.com)।
৩. আগের পুরনো PTENit (1).zip থেকে (10).zip ফাইলগুলো ডিলিট করে দিন এবং Trash Empty করুন।
৪. এই ZIP ফাইলটি আপলোড করুন।
৫. জিপ ফাইলটির ওপর রাইট ক্লিক করে "Extract" চাপুন।
৬. কাজ শেষ! ব্রাউজারে আপনার ডোমেইন ভিজিট করলেই পুরো ওয়েবসাইট চালু দেখতে পাবেন।

--------------------------------------------------------------------------------
পদ্ধতি ২: cPanel "Setup Node.js App" ব্যবহারের নিয়ম (যদি নোড ব্যবহার করতে চান):
--------------------------------------------------------------------------------
১. cPanel-এ "Setup Node.js App" এ গিয়ে Create Application করুন।
২. Application startup file: server.js দিন।
৩. "Run NPM Install" ক্লিক করুন।
৪. "Restart" ক্লিক করুন।

--------------------------------------------------------------------------------
পদ্ধতি ৩: নিজের কম্পিউটারে লোকালহোস্টে টেস্ট করার নিয়ম:
--------------------------------------------------------------------------------
১. ফোল্ডারে কমান্ড লাইন খুলে লিখুন: npx serve
অথবা:
২. node server.js লিখে এন্টার দিন এবং ব্রাউজারে http://localhost:3000 ওপেন করুন।

PTENit - অল-ইন-ওয়ান প্ল্যাটফর্ম সম্পূর্ণ প্রস্তুত!
================================================================================
''')

    # 8. Create the COMPLETE ZIP Archive (Ready for cPanel & Local)
    # We include everything in dist/, PLUS the complete source_code/ folder!
    zip_path = os.path.join(root, 'public', 'PTENit.zip')
    temp_zip = os.path.join(root, 'temp_package.zip')
    if os.path.exists(temp_zip):
        os.remove(temp_zip)

    with zipfile.ZipFile(temp_zip, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        # A. Write all production files at ROOT of zip (so extracting in public_html immediately works)
        for dirpath, dirnames, filenames in os.walk(dist_dir):
            for filename in filenames:
                if filename.endswith('.zip'):
                    continue
                fp = os.path.join(dirpath, filename)
                rel = os.path.relpath(fp, dist_dir)
                zf.write(fp, arcname=rel)
                
        # B. Also include the full project source code inside "source_code/" folder inside the zip
        # so any developer can inspect or modify every single TypeScript/React file!
        src_root = os.path.join(root, 'src')
        for dirpath, dirnames, filenames in os.walk(src_root):
            for filename in filenames:
                fp = os.path.join(dirpath, filename)
                rel = os.path.relpath(fp, root)
                zf.write(fp, arcname=os.path.join('source_code', rel))
                
        # Include root config files in source_code/
        for root_file in ['package.json', 'tsconfig.json', 'vite.config.ts', 'server.ts']:
            rf_path = os.path.join(root, root_file)
            if os.path.exists(rf_path):
                zf.write(rf_path, arcname=os.path.join('source_code', root_file))

    # Move to public/PTENit.zip and root PTENit.zip
    shutil.move(temp_zip, zip_path)
    shutil.copy2(zip_path, os.path.join(root, 'PTENit.zip'))
    shutil.copy2(zip_path, os.path.join(dist_dir, 'PTENit.zip'))

    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"\n[🎉 SUCCESS] Master ZIP created successfully!")
    print(f"Path: {zip_path}")
    print(f"Size: {size_mb:.2f} MB")

    # List contents summary
    with zipfile.ZipFile(zip_path, 'r') as zf:
        names = zf.namelist()
        print(f"Total files in archive: {len(names)}")
        print("Root level files:")
        root_files = [n for n in names if '/' not in n]
        for r in root_files:
            print(f"  - {r}")
        print("Folders included:")
        folders = set(n.split('/')[0] for n in names if '/' in n)
        for f in sorted(folders):
            count = len([n for n in names if n.startswith(f + '/')])
            print(f"  - {f}/ ({count} files)")

if __name__ == '__main__':
    main()
