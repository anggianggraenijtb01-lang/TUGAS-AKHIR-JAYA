const https = require('https');
const fs = require('fs');
const path = require('path');

const icons = [
  'qr-code',
  'wallet',
  'discount',
  'cash-in-hand',
  'bar-chart',
  'settings',
  'link',
  'online-store',
  'sprout',
  'carrot',
  'restaurant',
  'confetti',
  'checkmark',
  'shield',
  'search',
  'heart',
  'target',
  'layers',
  'cube',
  'edit',
  'image',
  'folder-invoices',
  'phone'
];

const dir = path.join(__dirname, 'public', 'assets', '3d');

async function download(name) {
  const url = `https://img.icons8.com/3d-fluency/188/${name}.png`;
  const dest = path.join(dir, `${name}.png`);
  
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          const stats = fs.statSync(dest);
          if (stats.size > 1000) {
            console.log(`✓ Downloaded ${name}.png (${stats.size} bytes)`);
            resolve(true);
          } else {
            console.log(`✗ File too small: ${name}`);
            try { fs.unlinkSync(dest); } catch(e){}
            resolve(false);
          }
        });
      } else {
        console.log(`✗ HTTP ${res.statusCode} for ${name}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`✗ Error for ${name}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  for (const name of icons) {
    await download(name);
  }
}

run();
