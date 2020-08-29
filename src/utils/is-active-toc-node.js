import { endsWith } from './ends-with';
/*
  Provided a current page slug, a slug, and a list of node children, returns
  true if either the given slug matches the current page slug or one of its children
  has a slug matching the giveen page slug, and false otherwise.
*/
export const isActiveTocNode = (currentUrl, slug, children) => {
  // "/" is a special case usually for titles. In this case we don't want other
  // pages to render as active
  if (slug === '/') return false;
  if (currentUrl === undefined) return false;
  if (endsWith(currentUrl, slug) || endsWith(currentUrl, `${slug}/`)) return true;
  if (children) {
    return children.reduce((a, b) => a || isActiveTocNode(currentUrl, b.slug, b.children), false);
  }
  return false;
};
