// Returns the name of the template to be used based on the site and page name.
const getTemplate = (page, site) => {
  switch (site) {
    case 'guides':
      return page === 'index' ? 'guides-index' : 'guide';
    case 'ecosystem':
      return page === 'index' ? 'ecosystem-index' : 'document';
    default:
      return 'document';
  }
};

module.exports.getTemplate = getTemplate;
