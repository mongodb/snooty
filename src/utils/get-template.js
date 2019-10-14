// Returns the name of the template to be used based on the site and page name.
const getTemplate = (page, site) => {
  let template = 'document';
  if (site === 'guides') {
    template = page === 'index' ? 'guides-index' : 'guide';
  }
  return template;
};

module.exports.getTemplate = getTemplate;
