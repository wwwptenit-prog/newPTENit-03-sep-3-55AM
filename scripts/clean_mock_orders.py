import json
import os

root = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
server_data = os.path.join(root, 'public', 'server_data')

# Reset default demo orders and enrollments to clean empty lists
files_to_clean = {
    'orders.json': [],
    'marketplaceOrders.json': [],
    'enrollments.json': [],
    'customerProjects.json': []
}

for fname, default_val in files_to_clean.items():
    fp = os.path.join(server_data, fname)
    with open(fp, 'w', encoding='utf-8') as f:
        json.dump(default_val, f, indent=2)
    print(f"[✓] Reset {fname} to empty list")

# Clean individual files if any in subdirectories
for sub in ['orders', 'marketplaceOrders', 'enrollments', 'customerProjects']:
    sub_path = os.path.join(server_data, sub)
    if os.path.exists(sub_path):
        import shutil
        shutil.rmtree(sub_path)
        os.makedirs(sub_path, exist_ok=True)
        print(f"[✓] Cleaned {sub}/ folder")

