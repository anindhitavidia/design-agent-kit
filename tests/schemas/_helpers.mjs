// tests/schemas/_helpers.mjs
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadSchema(name) {
  const path = resolve(__dirname, '../../plugins/core/schemas/v1', `${name}.schema.json`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function makeValidator(schema) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv.compile(schema);
}
