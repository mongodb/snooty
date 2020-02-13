const { execSync } = require('child_process');

const getGitBranch = () => {
  return execSync('git rev-parse --abbrev-ref HEAD')
    .toString('utf8')
    .replace(/[\n\r\s]+$/, '');
};

module.exports.getGitBranch = getGitBranch;
