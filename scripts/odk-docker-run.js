#!/usr/bin/env node
/**
 * Run a command inside the ODK Docker container with a project directory
 * mounted at /work. Cross-platform (Windows and Mac/Linux).
 *
 * Usage:
 *   node scripts/odk-docker-run.js "<command>"
 *   node scripts/odk-docker-run.js "<project_dir>" "<command>"
 *
 * When project_dir is omitted, uses process.cwd(). When provided (e.g. a clone
 * under projects/), that directory is mounted at /work so ROBOT and Make run
 * in the correct project context.
 *
 * Example (workspace ontology): node scripts/odk-docker-run.js "robot verify --input ontology/edit.owl"
 * Example (clone):             node scripts/odk-docker-run.js "projects/owner-repo" "robot verify --input src/envo/envo-edit.owl"
 */
const path = require('path');
const { spawnSync } = require('child_process');

const argv = process.argv.slice(2);
let workDir;
let command;

if (argv.length >= 2 && argv[0] !== '' && argv[0] != null) {
  workDir = path.resolve(argv[0]);
  command = argv[1];
} else if (argv.length === 1) {
  workDir = process.cwd();
  command = argv[0];
} else if (argv.length >= 2 && (argv[0] === '' || argv[0] == null)) {
  workDir = process.cwd();
  command = argv[1];
} else {
  console.error('Usage: node scripts/odk-docker-run.js "<command>"');
  console.error('   or: node scripts/odk-docker-run.js "<project_dir>" "<command>"');
  process.exit(1);
}

if (!command) {
  console.error('Missing command.');
  process.exit(1);
}

const args = [
  'run',
  '-v', `${workDir}:/work`,
  '-w', '/work',
  '--rm',
  'obolibrary/odkfull',
  'sh', '-c', command
];
const r = spawnSync('docker', args, { stdio: 'inherit' });
process.exit(r.status !== null ? r.status : 0);
