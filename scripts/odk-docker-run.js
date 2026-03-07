#!/usr/bin/env node
/**
 * Run a command inside the ODK Docker container with the current directory
 * mounted at /work. Cross-platform (Windows and Mac/Linux).
 * Usage: node scripts/odk-docker-run.js "<command>"
 * Example: node scripts/odk-docker-run.js "robot verify --input .base/bfo.owl"
 */
const { spawnSync } = require('child_process');
const cwd = process.cwd();
const command = process.argv[2];
if (!command) {
  console.error('Usage: node scripts/odk-docker-run.js "<command>"');
  process.exit(1);
}
const args = [
  'run',
  '-v', `${cwd}/src:/work`,
  '-w', '/work',
  '--rm',
  'obolibrary/odkfull',
  'sh', '-c', command
];
const r = spawnSync('docker', args, { stdio: 'inherit' });
process.exit(r.status !== null ? r.status : 0);
