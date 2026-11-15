import { cp, mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
const destination = join(process.env.MAKEFUN_OUTPUT_DIR || '/output', 'entry.png');

try {
  const sourceInfo = await stat(source);
  if (!sourceInfo.isFile()) throw new Error('entry.png is not a regular file');
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination);
  const copiedInfo = await stat(destination);
  if (copiedInfo.size !== sourceInfo.size) {
    throw new Error(`copy size mismatch (source ${sourceInfo.size}, output ${copiedInfo.size})`);
  }
  console.log(`Copied entry.png to ${destination}`);
  process.exitCode = 0;
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`Unable to copy entry.png: ${detail}`);
  process.exitCode = 1;
}
