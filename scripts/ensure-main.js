const { execSync } = require('child_process');

const getGitBranch = () => {
  return execSync('git rev-parse --abbrev-ref HEAD')
    .toString('utf8')
    .replace(/[\n\r\s]+$/, '');
};

const ensureMain = () => getGitBranch() === 'main';

const main = () => {
  let warned = false;

  if (!ensureMain()) {
    warned = true;
    console.error('ERROR: Can only release on main');
  }

  if (warned) {
    process.exit(1);
  }
};

main();
