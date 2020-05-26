// Returns the name of the template to be used based on the site and page name.
const getTemplate = (site, page, template) => {
  switch (template) {
    case 'landing':
      return 'landing';
    case 'docs-landing':
      return 'docs-landing';
    default:
      switch (site) {
        case 'guides':
          return page === 'index' ? 'guides-index' : 'guide';
        case 'drivers':
          return page === 'index' ? 'ecosystem-index' : 'document';
        default:
          return 'document';
      }
  }
};

module.exports.getTemplate = getTemplate;
