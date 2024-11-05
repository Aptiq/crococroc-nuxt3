const { execSync } = require('child_process');

try {
  // Installation des dépendances avec pnpm
  execSync('pnpm install --no-frozen-lockfile', { stdio: 'inherit' });
} catch (error) {
  console.error('Installation failed:', error);
  process.exit(1);
}