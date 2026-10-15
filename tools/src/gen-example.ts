/**
 * Writes examples/rosewood-courtyard/: one of Atrium's demo websites as an unzipped site bundle, in
 * the loose input form an agent writes (ids optional), so the skill has a complete, valid reference.
 */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { registry } from '@atrium/component-registry';
import { normalizeWebsite } from '@atrium/builder-core/normalize';
import { buildSiteBundle } from '@atrium/exporter/bundle';
import { getDemoSite } from '@atrium/templates';
import type { WebsiteDefinition } from '@atrium/schema';

const outRoot = process.argv[2]!;
const demo = getDemoSite('rosewood-courtyard') ?? getDemoSite('rosewood');
if (!demo) throw new Error('Rosewood demo not found in @atrium/templates');

const { issues } = normalizeWebsite(demo.website, registry);
const errors = issues.filter((i) => i.severity === 'error');
if (errors.length) throw new Error(`Demo does not normalize cleanly:\n${errors.map((e) => `${e.path}: ${e.message}`).join('\n')}`);

const files = buildSiteBundle({ schemaVersion: 1, ...demo.website } as unknown as WebsiteDefinition, { website: { name: demo.name, slug: demo.slug }, exportedAt: '2026-01-01T00:00:00.000Z' });
delete files['media-manifest.json'];
const dir = path.join(outRoot, 'rosewood-courtyard');
rmSync(dir, { recursive: true, force: true });
for (const [name, content] of Object.entries(files)) {
  mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
  writeFileSync(path.join(dir, name), content);
}
console.log(`example: ${demo.key} (${Object.keys(files).length} files)`);
