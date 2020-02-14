const { getGitBranch } = require('../src/utils/get-git-branch');

const ensureMaster = () => getGitBranch() === 'master';

const main = () => {
  let warned = false;

  if (!ensureMaster()) {
    warned = true;
    console.error('Can only release on master');
  }

  if (warned) {
    process.exit(1);
  }
};

main();
