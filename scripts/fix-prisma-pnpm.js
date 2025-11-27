const fs = require('fs');
const path = require('path');

function main(){
  try{
    const pkgJsonPath = require.resolve('@prisma/client/package.json');
    const pkgDir = path.dirname(pkgJsonPath);
    // pnpm layout: .../node_modules/.pnpm/<pkg>/node_modules/@prisma/client
    // the generated .prisma folder is placed under the shared `node_modules` directory
    const pnpmNodeModules = path.dirname(path.dirname(pkgDir)); // .../node_modules/.pnpm/.../node_modules
    const generatedPrismaDir = path.join(pnpmNodeModules, '.prisma', 'client');
    const linkPath = path.join(pkgDir, '.prisma');

    if (!fs.existsSync(generatedPrismaDir)){
      // Nothing to do
      return;
    }

    if (fs.existsSync(linkPath)){
      // Already exists
      return;
    }

    // Create symlink (directory) pointing from package to generated .prisma
    try{
      fs.symlinkSync(generatedPrismaDir, linkPath, 'dir');
      console.log('Created prisma symlink:', linkPath, '->', generatedPrismaDir);
    }catch(err){
      // On Windows or permission issues, attempt a directory copy as fallback
      console.error('Could not create symlink for prisma client:', err && err.message ? err.message : err);
    }
  }catch(e){
    // Fail silently during installs where @prisma/client is not present yet
    // but print a helpful message for debugging
    console.error('fix-prisma-pnpm: failed to link prisma types (this may be harmless):', e && e.message ? e.message : e);
  }
}

main();
