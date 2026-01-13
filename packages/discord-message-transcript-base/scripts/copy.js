import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.resolve(__dirname, '..');
const distPath = path.resolve(basePath, 'dist/assets');
const srcPath = path.resolve(basePath, 'src/assets');

async function copyAssets() {
    try {
        await fs.mkdir(distPath, { recursive: true });

        const cssSource = path.join(srcPath, 'style.css');
        const cssDest = path.join(distPath, 'style.css');
        await fs.copyFile(cssSource, cssDest);
        console.log('Copied style.css to dist/style.css');

        const jsSource = path.join(srcPath, 'script.js');
        const jsDest = path.join(distPath, 'script.js');
        await fs.copyFile(jsSource, jsDest);
        console.log('Copied script.js to dist/script.js');

    } catch (error) {
        console.error('Error copying assets:', error);
        process.exit(1);
    }
}

copyAssets();
