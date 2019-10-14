// Returns the name of the template to be used based on the site and page name.
const getTemplate = page => {
  let template = 'document';
  if (process.env.GATSBY_SITE === 'guides') {
    template = page === 'index' ? 'guides-index' : 'guide';
  }
  return template;
};

module.exports.getTemplate = getTemplate;
