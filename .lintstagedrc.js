const { CLIEngine } = require('eslint');

// lint-staged seems to disregard eslint ignore rules if we have the eslint
// "--max-warnings 0" option set. This will potentially break our linting process
// if we are staging files that we want ignored (such as .eslintrc.js).

// This was the recommended fix according to lint-staged's README:
// https://github.com/okonet/lint-staged/blob/fa15d686deb90b7ffddfbcf644d56ed05fcd8a38/README.md#how-can-i-ignore-files-from-eslintignore

module.exports = {
  '*.{js,jsx,ts,tsx}': (files) => {
    const cli = new CLIEngine({});
    const filesToLint = files.filter((file) => !cli.isPathIgnored(file)).join(' ');
    return ['npm run format:fix', `npm run lint:fix -- ${filesToLint}`];
  },
};
