import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'src', 'data', 'providers.json');
const logosDir = path.join(process.cwd(), 'public', 'logos');

async function downloadLogo(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) return false;
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) return false;

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Ignore extremely small files (e.g. 1x1 transparent pixel) from Clearbit which mean "not found"
    if (buffer.length < 200) return false;

    await fs.writeFile(dest, buffer);
    return true;
  } catch (error) {
    return false;
  }
}

async function run() {
  console.log("Starting logo download process...");
  await fs.mkdir(logosDir, { recursive: true });
  
  const rawData = await fs.readFile(dataPath, 'utf8');
  const providers = JSON.parse(rawData);
  let downloadedCount = 0;

  for (const provider of providers) {
    if (provider.logoUrl && provider.logoUrl.includes('google.com/s2/favicons')) {
      console.log(`Downloading logo for ${provider.name}...`);
      const destPath = path.join(logosDir, `${provider.slug}.png`);
      const success = await downloadLogo(provider.logoUrl, destPath);
      
      if (success) {
        provider.logoUrl = `/logos/${provider.slug}.png`;
        downloadedCount++;
      } else {
        delete provider.logoUrl; // Remove so frontend uses text fallback
      }
    }
  }

  await fs.writeFile(dataPath, JSON.stringify(providers, null, 2));
  console.log(`Done! Successfully downloaded and linked ${downloadedCount} logos.`);
}

run().catch(console.error);
