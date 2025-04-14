export const isCurrentPage = (currentUrl, slug) => {
  const trimSlashes = (str) => str.replace(/^\/|\/$/g, '');
  if (!currentUrl || !slug) return false;
  return trimSlashes(currentUrl) === trimSlashes(slug);
};
