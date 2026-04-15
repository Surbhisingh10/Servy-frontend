const { spawnSync } = require('child_process');
const path = require('path');
const { Module } = require('module');
const { ensureNextDistDir } = require('./ensure-next-dist.cjs');

const projectNodeModules = path.resolve(__dirname, '..', 'node_modules');

process.env.NODE_PATH = process.env.NODE_PATH
  ? `${projectNodeModules}${path.delimiter}${process.env.NODE_PATH}`
  : projectNodeModules;

Module._initPaths();

const command = process.argv[2];
if (!process.env.NEXT_DIST_DIR) {
  // On Vercel, always use the standard .next dir so the platform can find the output
  process.env.NEXT_DIST_DIR = (command === 'dev' || process.env.VERCEL) ? '.next' : '.next-local';
}

ensureNextDistDir();

const nextBin = require.resolve('next/dist/bin/next');
// Always skip ESLint for production builds — linting errors must not block deployment
const args = process.argv.slice(2);
if (command === 'build' && !args.includes('--no-lint')) {
  args.push('--no-lint');
}
const result = spawnSync(process.execPath, [nextBin, ...args], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
