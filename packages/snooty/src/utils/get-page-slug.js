// Takes a look at the page name and returns the appropriate page url
export const getPageSlug = (page) => {
  return page === "index" ? "/" : page;
};
