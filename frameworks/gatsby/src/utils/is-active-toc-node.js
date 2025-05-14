import { isCurrentPage } from './is-current-page';
/*
  Provided a current page slug, a slug, and a list of node children, returns
  true if either the given slug matches the current page slug or one of its children
  has a slug matching the given page slug, and false otherwise.
*/
export const isActiveTocNode = (currentUrl, slug, children) => {
  if (currentUrl === undefined) return false;
  if (isCurrentPage(currentUrl, slug)) return true;
  if (children) {
    return children.reduce((a, b) => a || isActiveTocNode(currentUrl, b.slug, b.children), false);
  }
  return false;
};
