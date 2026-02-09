import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const resources = {
  style: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/atom-one-dark.min.css',
  script: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js'
};

async function generateHashes() {
  const hashes = {};

  console.log('Fetching resources and generating SRI hashes...');

  for (const [key, url] of Object.entries(resources)) {
    try {
      console.log(`- Fetching ${key} from ${url}`);
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Error: Failed to fetch ${url} - Status ${response.status}`);
        continue;
      }

      const body = await response.arrayBuffer();
      const hash = crypto.createHash('sha384').update(new Uint8Array(body)).digest('base64');
      
      hashes[key] = `sha384-${hash}`;
      console.log(`Done: ${hashes[key]}`);
    } catch (error) {
      console.error(`Error: Failed to process ${url}`, error);
    }
  }

  const outputPath = path.join(import.meta.dirname, '../src/assets/highlightJsHash.json');
  await fs.writeFile(outputPath, JSON.stringify(hashes, null, 2));

  console.log(`Successfully generated hashes and saved to ${outputPath}`);
}

generateHashes();