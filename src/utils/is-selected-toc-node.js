import { endsWith } from './ends-with';

/*
  Provided the current url and a node slug, returns true if the user is on this
  page for navigation and false otherwise (defined as checking the url ending)
*/
export const isSelectedTocNode = (currentUrl, slug) => {
  if (currentUrl === undefined) return false;
  return endsWith(currentUrl, slug) || endsWith(currentUrl, `${slug}/`);
};
