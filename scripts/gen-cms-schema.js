#!/usr/bin/env node
// Generates the CMS field schema from content.json.
//
// Hand-writing ~250 lines of YAML against a 42KB nested object invites silent
// mismatches: a field named wrong in the schema simply never appears in the
// editor, and a field omitted is silently dropped on save. Deriving it from the
// data guarantees the schema and the content agree.
//
// Re-run after changing content.json's *shape* (not its values):
//   node scripts/gen-cms-schema.js > admin/fields.yml

const fs = require('fs');
const content = JSON.parse(fs.readFileSync('content.json', 'utf8'));

const LONG = /^(desc|intro|summary|blurb|body|text|answer|problem|approach|copy|sub)$/i;
const MULTILINE_MIN = 90;

const label = (k) =>
  k.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
   .replace(/^./, (c) => c.toUpperCase())
   .replace(/\bSec\b/, 'section');

const indent = (n) => '  '.repeat(n);

function field(key, value, depth) {
  const pad = indent(depth);
  const head = `${pad}- name: ${key}\n${pad}  label: ${JSON.stringify(label(key))}`;

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${head}\n${pad}  widget: list`;
    }
    const sample = value[0];
    if (sample !== null && typeof sample === 'object') {
      // Merge keys across all items so optional fields aren't lost.
      const keys = [...new Set(value.flatMap((v) => Object.keys(v || {})))];
      const merged = {};
      for (const k of keys) merged[k] = value.find((v) => v && v[k] !== undefined)?.[k] ?? '';
      const summary = keys.includes('title') ? '{{fields.title}}'
                    : keys.includes('label') ? '{{fields.label}}'
                    : keys.includes('head')  ? '{{fields.head}}'
                    : keys.includes('num')   ? '{{fields.num}}'
                    : null;
      return [
        head,
        `${pad}  widget: list`,
        summary ? `${pad}  summary: ${JSON.stringify(summary)}` : null,
        `${pad}  collapsed: true`,
        `${pad}  fields:`,
        keys.map((k) => field(k, merged[k], depth + 2)).join('\n'),
      ].filter(Boolean).join('\n');
    }
    // list of primitives
    return `${head}\n${pad}  widget: list\n${pad}  field:\n${pad}    - name: value\n${pad}      label: Value\n${pad}      widget: string`;
  }

  if (value !== null && typeof value === 'object') {
    return [
      head,
      `${pad}  widget: object`,
      `${pad}  collapsed: true`,
      `${pad}  fields:`,
      Object.entries(value).map(([k, v]) => field(k, v, depth + 2)).join('\n'),
    ].join('\n');
  }

  if (typeof value === 'number') return `${head}\n${pad}  widget: number\n${pad}  required: false`;
  if (typeof value === 'boolean') return `${head}\n${pad}  widget: boolean\n${pad}  required: false`;

  const s = String(value ?? '');
  const widget = LONG.test(key) || s.length > MULTILINE_MIN ? 'text' : 'string';
  return `${head}\n${pad}  widget: ${widget}\n${pad}  required: false`;
}

// depth 5 == 10 spaces, which is where `fields:` sits under a file collection
const out = Object.entries(content)
  .map(([k, v]) => field(k, v, 5))
  .join('\n');

process.stdout.write(out + '\n');
