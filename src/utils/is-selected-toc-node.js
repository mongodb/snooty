import { isCurrentPage } from './is-current-page';

/*
  Provided the current url and a node slug, returns true if the user is on this
  page for navigation and false otherwise (defined as checking the url ending)
*/
export const isSelectedTocNode = (currentUrl, slug) => {
  if (currentUrl === undefined) return false;
  // console.log(`isCurrentPage(${currentUrl}, ${slug})`, isCurrentPage(currentUrl, slug));
  return isCurrentPage(currentUrl, slug);
};
