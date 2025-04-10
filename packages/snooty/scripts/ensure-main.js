const { execSync } = require('child_process');

const getGitBranch = () => {
  return execSync('git rev-parse --abbrev-ref HEAD')
    .toString('utf8')
    .replace(/[\n\r\s]+$/, '');
};

const ensureMaster = () => ['main', 'master'].includes(getGitBranch());

const main = () => {
  let warned = false;

  if (!ensureMaster()) {
    warned = true;
    console.error('ERROR: Can only release on master');
  }

  if (warned) {
    process.exit(1);
  }
};

main();
