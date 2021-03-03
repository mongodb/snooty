// Takes a look at the page name and returns the appropriate page url
const getPageSlug = (page) => {
  return page === 'index' ? '/' : page;
};

module.exports.getPageSlug = getPageSlug;
