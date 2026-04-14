const fs = require('fs');
const path = require('path');

function ensureNextDistDir(distDir = process.env.NEXT_DIST_DIR || '.next') {
  const resolvedPath = path.resolve(process.cwd(), distDir);

  try {
    const stats = fs.lstatSync(resolvedPath);
    if (stats.isSymbolicLink() || stats.isDirectory()) {
      fs.rmSync(resolvedPath, { force: true, recursive: true });
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }

  fs.mkdirSync(resolvedPath, { recursive: true });
  return resolvedPath;
}

if (require.main === module) {
  ensureNextDistDir();
}

module.exports = { ensureNextDistDir };
