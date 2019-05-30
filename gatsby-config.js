const runningEnv = process.env.NODE_ENV || 'production';
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const userInfo = require('os').userInfo;

require('dotenv').config({
  path: `.env.${runningEnv}`,
});

const getGitBranch = async () => {
  return exec('git rev-parse --abbrev-ref HEAD');
};

const getPathPrefix = () => {
  const user = userInfo().username;
  const gitBranch = getGitBranch();

  return (
    process.env.GATSBY_PREFIX ||
    (runningEnv === 'production' ? `/${process.env.GATSBY_SITE}/${user}/${gitBranch}` : '/')
  );
};

module.exports = {
  pathPrefix: getPathPrefix(),
};
