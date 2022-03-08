const { CLIEngine } = require('eslint');

module.exports = {
  '*.js': (files) => {
    const cli = new CLIEngine({});
    const filesToLint = files.filter((file) => !cli.isPathIgnored(file)).join(' ');
    return ['npm run format:fix', `npm run lint:fix -- ${filesToLint}`];
  },
};
