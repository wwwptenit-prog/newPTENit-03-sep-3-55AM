import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rawConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'firebase-applet-config.json'), 'utf-8'));
const app = initializeApp(rawConfig);
const db = getFirestore(app, rawConfig.firestoreDatabaseId);

const dirs = [
  path.join(rootDir, 'server_data'), 
  path.join(rootDir, 'public', 'server_data')
];
dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function main() {
  const collectionNames = [
    'siteSettings', 'courses', 'services', 'users', 'marketplaceOrders',
    'orders', 'gigs', 'jobs', 'digitalProducts', 'gallery', 'testimonials', 
    'offers', 'enrollments', 'companyBills', 'notifications'
  ];

  for (const colName of collectionNames) {
    let items = [];
    try {
      const snap = await getDocs(collection(db, colName));
      if (!snap.empty) {
        items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        console.log(`[Firestore] ${colName}: found ${items.length} live documents`);
      }
    } catch (err) {
      console.warn(`[Firestore Error] ${colName}:`, err.message);
    }

    dirs.forEach(dir => {
      const colFile = path.join(dir, `${colName}.json`);
      fs.writeFileSync(colFile, JSON.stringify(items, null, 2), 'utf-8');

      const subDir = path.join(dir, colName);
      if (!fs.existsSync(subDir)) fs.mkdirSync(subDir, { recursive: true });
      items.forEach(item => {
        const id = item.id || (colName === 'siteSettings' ? 'default' : null);
        if (id) {
          fs.writeFileSync(path.join(subDir, `${id}.json`), JSON.stringify(item, null, 2), 'utf-8');
        }
      });
    });
  }

  console.log('✅ Server storage files generated successfully in public/server_data and server_data!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
