#!/usr/bin/env python3
import os
import shutil
import zipfile

root = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
dist_dir = os.path.join(root, 'dist')

# Master collections to include in server_data (only single json files, no subdirectories)
target_collections = [
    'siteSettings.json', 'courses.json', 'services.json', 'users.json',
    'gigs.json', 'jobs.json', 'digitalProducts.json', 'gallery.json',
    'testimonials.json', 'orders.json', 'marketplaceOrders.json',
    'offers.json', 'enrollments.json', 'companyBills.json', 'notifications.json'
]

# We build PTENit_Ultra_Light.zip
zip_path = os.path.join(root, 'public', 'PTENit.zip')
if os.path.exists(zip_path):
    os.remove(zip_path)

print("[*] Packing ultra-light zip with ZERO redundant files...")
with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
    # 1. assets/ folder (all js and css)
    assets_dir = os.path.join(dist_dir, 'assets')
    for f in sorted(os.listdir(assets_dir)):
        fp = os.path.join(assets_dir, f)
        zf.write(fp, arcname=f"assets/{f}")

    # 2. Root files
    zf.write(os.path.join(dist_dir, 'index.html'), arcname='index.html')
    zf.write(os.path.join(dist_dir, '.htaccess'), arcname='.htaccess')
    zf.write(os.path.join(dist_dir, 'manifest.json'), arcname='manifest.json')
    zf.write(os.path.join(dist_dir, 'api', 'sync.php'), arcname='api/sync.php')

    # 3. Only the 15 master collection json files in server_data/
    src_sd = os.path.join(root, 'public', 'server_data')
    for col in target_collections:
        fp = os.path.join(src_sd, col)
        if os.path.exists(fp):
            zf.write(fp, arcname=f"server_data/{col}")

# Copy to root and dist
shutil.copy2(zip_path, os.path.join(root, 'PTENit.zip'))
shutil.copy2(zip_path, os.path.join(dist_dir, 'PTENit.zip'))

size_kb = os.path.getsize(zip_path) / 1024
print(f"[+] DONE! Ultra-Light PTENit.zip size: {size_kb:.1f} KB")

with zipfile.ZipFile(zip_path, 'r') as zf:
    print(f"Total files in archive: {len(zf.namelist())}")
    for n in zf.namelist():
        print(f"  {n}")
