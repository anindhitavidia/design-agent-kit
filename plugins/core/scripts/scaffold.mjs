import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_ROOT = resolve(__dirname, '../templates');

const TEMPLATE_FILES = [
  'DESIGN.md',
  'REVIEW.md',
  'CODING_GUIDELINES.md',
  'design-kit.config.json',
  'docs/context/product.md',
  'docs/context/brand.md',
  'docs/context/design-system.md',
  'docs/context/personas.md',
  'docs/context/coding-rules.md'
];

export function scaffold({ targetRoot, force = false, config = null }) {
  const created = [];
  const skipped = [];

  for (const rel of TEMPLATE_FILES) {
    const target = join(targetRoot, rel);
    if (existsSync(target) && !force) {
      skipped.push(rel);
      continue;
    }
    mkdirSync(dirname(target), { recursive: true });
    let content = readFileSync(join(TEMPLATES_ROOT, rel), 'utf8');
    if (rel === 'design-kit.config.json' && config) {
      const parsed = JSON.parse(content);
      Object.assign(parsed, config);
      content = JSON.stringify(parsed, null, 2) + '\n';
    }
    writeFileSync(target, content);
    created.push(rel);
  }

  return { created, skipped };
}
