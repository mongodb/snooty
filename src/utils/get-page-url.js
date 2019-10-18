// Takes a look at the page name and returns the appropriate page url
const getPageUrl = page => {
  return page === 'index' ? '/' : page;
};

module.exports.getPageUrl = getPageUrl;
