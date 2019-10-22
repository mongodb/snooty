/*
  Provided a current page slug, a slug, and a list of node children, returns
  true if either the given slug matches the current page slug or one of its children
  has a slug matching the giveen page slug, and false otherwise.
*/
export const isActiveTocNode = (activeSlug, currentSlug, children) => {
  if (currentSlug === undefined) return false;
  if (currentSlug === activeSlug) return true;
  return children.reduce((a, b) => a || isActiveTocNode(activeSlug, b.slug, b.children), false);
};
