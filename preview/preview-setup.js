// eslint-disable-next-line import/no-unresolved
const pageAST = require('./page-ast.json'); // File created by Snooty extension on VS Code

// Returns bare minimum data needed by a single page
export const getPageData = async () => {
  const fileId = process.env.PREVIEW_PAGE;
  const pageNodes = {
    ast: pageAST,
  };

  // Pick which template to use
  let template = 'document';
  if (process.env.GATSBY_SITE === 'guides') {
    template = fileId === 'index' ? 'guides-index' : 'guide';
  }

  return {
    path: '',
    template,
    context: {
      snootyStitchId: '',
      __refDocMapping: pageNodes,
      pageMetadata: {},
    },
  };
};
