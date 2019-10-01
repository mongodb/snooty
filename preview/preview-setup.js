// eslint-disable-next-line import/no-unresolved
const pageAST = require('./page-ast.json'); // File created by Snooty extension on VS Code

// Returns bare minimum data needed by a single page
export const getPageData = async () => {
  const pageNodes = {
    ast: pageAST,
  };

  return {
    path: '',
    template: 'guide',
    context: {
      snootyStitchId: '',
      __refDocMapping: pageNodes,
      pageMetadata: {},
    },
  };
};
