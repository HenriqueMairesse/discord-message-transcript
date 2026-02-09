
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

// Mapeia as chaves aos caminhos dos arquivos locais
const localAssets = {
  style: path.join(import.meta.dirname, '../src/assets/style.css'),
  script: path.join(import.meta.dirname, '../src/assets/script.js'),
};

async function generateLocalHashes() {
  const hashes = {};

  console.log('Reading local assets and generating SRI hashes...');

  for (const [key, filePath] of Object.entries(localAssets)) {
    try {
      console.log(`- Reading ${key} from ${filePath}`);
      
      const fileContent = await fs.readFile(filePath);

      const hash = crypto.createHash('sha384').update(fileContent).digest('base64');
      
      hashes[key] = `sha384-${hash}`;
      console.log(`  Done: ${hashes[key]}`);
    } catch (error) {
      console.error(`Error: Failed to process ${filePath}`, error);
    }
  }

  const outputPath = path.join(import.meta.dirname, '../src/assets/transcriptHash.json');
  await fs.writeFile(outputPath, JSON.stringify(hashes, null, 2));

  console.log(`Successfully generated hashes and saved to ${outputPath}`);
}

generateLocalHashes();
