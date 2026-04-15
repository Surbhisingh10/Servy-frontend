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
const result = spawnSync(process.execPath, [nextBin, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
