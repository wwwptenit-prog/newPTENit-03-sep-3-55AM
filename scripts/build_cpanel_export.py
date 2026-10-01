#!/usr/bin/env python3
import os
import shutil
import subprocess
import zipfile
import sys

def find_workspace_root():
    # Check current working directory and parents for package.json
    curr = os.path.abspath(os.getcwd())
    while curr and curr != '/':
        if os.path.exists(os.path.join(curr, 'package.json')):
            return curr
        curr = os.path.dirname(curr)
    # Check script file location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    parent = os.path.dirname(script_dir)
    if os.path.exists(os.path.join(parent, 'package.json')):
        return parent
    if os.path.exists('/app/applet/package.json'):
        return '/app/applet'
    return os.path.abspath('.')

def main():
    workspace_root = find_workspace_root()
    print(f"[*] Workspace Root: {workspace_root}")

    # 1. Clean previous zips to prevent nested/inflated archives
    for folder in ['public', 'dist', '.']:
        for z in ['PTENit.zip', 'ptenit_cpanel_upload.zip', 'cpanel-deployment-ready.zip', 'public_html.zip']:
            target = os.path.join(workspace_root, folder, z)
            if os.path.exists(target):
                try:
                    os.remove(target)
                    print(f"[-] Removed stale archive: {target}")
                except Exception as e:
                    print(f"[!] Warning removing {target}: {e}")

    # 2. Run Vite build
    print("[*] Running 'npm run build' in workspace...")
    build_cmd = ["npm", "run", "build"]
    result = subprocess.run(build_cmd, cwd=workspace_root, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"[x] Build failed:\n{result.stderr}\n{result.stdout}")
        sys.exit(1)
    print("[+] Build succeeded!")

    dist_dir = os.path.join(workspace_root, 'dist')
    if not os.path.exists(dist_dir):
        print(f"[x] Dist directory {dist_dir} does not exist!")
        sys.exit(1)

    # 3. Ensure .htaccess is in dist
    dist_htaccess = os.path.join(dist_dir, '.htaccess')
    src_htaccess = os.path.join(workspace_root, 'public', '.htaccess')
    if not os.path.exists(dist_htaccess) and os.path.exists(src_htaccess):
        shutil.copy2(src_htaccess, dist_htaccess)
        print("[+] Copied .htaccess to dist/.htaccess")

    # 4. Ensure api/sync.php is in dist/api/sync.php
    dist_api_dir = os.path.join(dist_dir, 'api')
    src_api_dir = os.path.join(workspace_root, 'public', 'api')
    if os.path.exists(src_api_dir):
        if not os.path.exists(dist_api_dir):
            shutil.copytree(src_api_dir, dist_api_dir)
            print("[+] Copied api/ directory to dist/api/")

    # 5. Ensure server_data/ is in dist/server_data/ (only root collection json files, no subdirs)
    dist_server_data = os.path.join(dist_dir, 'server_data')
    src_server_data = os.path.join(workspace_root, 'public', 'server_data')
    if os.path.exists(dist_server_data):
        shutil.rmtree(dist_server_data)
    os.makedirs(dist_server_data, exist_ok=True)

    if os.path.exists(src_server_data):
        for f in os.listdir(src_server_data):
            if f.endswith('.json'):
                src_file = os.path.join(src_server_data, f)
                shutil.copy2(src_file, os.path.join(dist_server_data, f))
        print("[+] Copied clean master JSON files to dist/server_data/")

    # 6. Ensure README_CPANEL_INSTRUCTIONS.txt is in dist
    dist_readme = os.path.join(dist_dir, 'README_CPANEL_INSTRUCTIONS.txt')
    src_readme = os.path.join(workspace_root, 'public', 'README_CPANEL_INSTRUCTIONS.txt')
    if not os.path.exists(dist_readme) and os.path.exists(src_readme):
        shutil.copy2(src_readme, dist_readme)
        print("[+] Copied README_CPANEL_INSTRUCTIONS.txt to dist/")

    # 7. Build ZIP Archive
    output_zip_temp = os.path.join(workspace_root, 'temp_production_cpanel.zip')
    if os.path.exists(output_zip_temp):
        os.remove(output_zip_temp)

    # Gather all files and prioritize assets/ and index.html
    files_to_pack = []
    for root, dirs, files in os.walk(dist_dir):
        for file in files:
            if file.endswith('.zip') or file.startswith('server.cjs'):
                continue
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, dist_dir)
            files_to_pack.append((file_path, rel_path))

    # Priority sort: assets & html first, then htaccess, php, json
    def sort_priority(item):
        p = item[1]
        if p.startswith('assets/'):
            return 0
        if p == 'index.html':
            return 1
        if p == '.htaccess':
            return 2
        if p.startswith('api/'):
            return 3
        return 4

    files_to_pack.sort(key=sort_priority)

    files_packed = []
    print("[*] Packaging files into ZIP...")
    with zipfile.ZipFile(output_zip_temp, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for file_path, rel_path in files_to_pack:
            zipf.write(file_path, arcname=rel_path)
            files_packed.append(rel_path)

    zip_size_mb = os.path.getsize(output_zip_temp) / (1024 * 1024)
    print(f"[+] ZIP generated successfully! Total size: {zip_size_mb:.2f} MB ({len(files_packed)} files)")

    # 6. Copy zip to all target locations
    target_locations = [
        os.path.join(workspace_root, 'cpanel-deployment-ready.zip'),
        os.path.join(workspace_root, 'PTENit.zip'),
        os.path.join(workspace_root, 'ptenit_cpanel_upload.zip'),
        os.path.join(workspace_root, 'public', 'cpanel-deployment-ready.zip'),
        os.path.join(workspace_root, 'public', 'PTENit.zip'),
        os.path.join(workspace_root, 'public', 'ptenit_cpanel_upload.zip'),
        os.path.join(workspace_root, 'dist', 'cpanel-deployment-ready.zip'),
        os.path.join(workspace_root, 'dist', 'PTENit.zip'),
        os.path.join(workspace_root, 'dist', 'ptenit_cpanel_upload.zip'),
    ]

    for loc in target_locations:
        os.makedirs(os.path.dirname(loc), exist_ok=True)
        shutil.copy2(output_zip_temp, loc)
        print(f"[+] Saved archive: {loc}")

    if os.path.exists(output_zip_temp):
        os.remove(output_zip_temp)

    # 7. Print summary of archive contents
    print("\n" + "="*60)
    print("CPANEL PRODUCTION ZIP EXPORT SUMMARY:")
    print("="*60)
    with zipfile.ZipFile(target_locations[0], 'r') as z:
        for info in z.infolist()[:15]:
            print(f" - {info.filename} ({info.file_size:,} bytes)")
        if len(z.infolist()) > 15:
            print(f" ... and {len(z.infolist()) - 15} more files.")
    print("="*60)

if __name__ == '__main__':
    main()
