import { readdir, stat, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
}
let checked = 0;
for (const file of [...await walk(path.join(root, 'src')), ...await walk(path.join(root, 'scripts'))]) {
  if (!/\.m?js$/.test(file)) continue;
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) { console.error(result.stderr); process.exit(1); }
  checked++;
}
for (const relative of ['index.html', 'assets/DM-Sans-Regular.ttf', 'assets/DM-Sans-Bold.ttf', 'assets/FONT-LICENSE.txt']) if ((await stat(path.join(root, relative))).size === 0) throw new Error(`Missing content: ${relative}`);
for (const file of await walk(path.join(root, 'src'))) {
  if (!file.endsWith('.js')) continue;
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) if (match[1].startsWith('.')) await stat(path.resolve(path.dirname(file), match[1]));
}
console.log(`Checked ${checked} JavaScript files, module imports and bundled assets.`);
