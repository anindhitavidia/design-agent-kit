import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = process.cwd();
const marketplacePath = join(root, '.claude-plugin', 'marketplace.json');

if (!existsSync(marketplacePath)) {
  console.error('marketplace.json not found at .claude-plugin/marketplace.json');
  process.exit(1);
}

const marketplace = JSON.parse(readFileSync(marketplacePath, 'utf8'));
const errors = [];

if (!marketplace.name) errors.push('marketplace.name is required');
if (!marketplace.owner?.name) errors.push('marketplace.owner.name is required');
if (!Array.isArray(marketplace.plugins)) errors.push('marketplace.plugins must be an array');

for (const plugin of marketplace.plugins ?? []) {
  if (!plugin.name) {
    errors.push(`plugin missing name: ${JSON.stringify(plugin)}`);
    continue;
  }
  if (!plugin.source) {
    errors.push(`plugin ${plugin.name}: source is required`);
    continue;
  }
  if (typeof plugin.source !== 'string') continue;
  const pluginDir = resolve(root, plugin.source);
  const manifestPath = join(pluginDir, '.claude-plugin', 'plugin.json');
  if (!existsSync(manifestPath)) {
    errors.push(`plugin ${plugin.name}: manifest missing at ${manifestPath}`);
    continue;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.name !== plugin.name) {
    errors.push(`plugin ${plugin.name}: manifest name "${manifest.name}" does not match marketplace entry`);
  }
}

if (errors.length > 0) {
  console.error('Marketplace validation failed:');
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

console.log('Marketplace OK:', marketplace.plugins.length, 'plugins.');
