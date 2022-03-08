const { CLIEngine } = require('eslint');

module.exports = {
  '*.js': (files) => {
    const cli = new CLIEngine({});
    return 'eslint --max-warnings=0 ' + files.filter((file) => !cli.isPathIgnored(file)).join(' ');
  },
}
