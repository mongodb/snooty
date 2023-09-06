import { isGatsbyPreview } from './is-gatsby-preview';

export const isCurrentPage = (currentUrl, slug) => {
  // If we're in preview mode, we build the pages of each branch of the site within
  // its own namespace so each author can preview their own pages e.g.
  // /BRANCH--branch1/doc-path
  // /BRANCH--branch2/doc-path
  //
  // So to detect if we're on the active page, we need to remove the namespace from
  // the currentUrl.
  let modifiedCurrentUrl = currentUrl;
  const firstPathSegment = currentUrl.split(`/`).slice(0, 1)[0];
  if (isGatsbyPreview && firstPathSegment.startsWith(`BRANCH--`)) {
    modifiedCurrentUrl = currentUrl.split(`/`).slice(1).join(`/`);
  }
  const trimSlashes = (str) => str.replace(/^\/|\/$/g, '');
  if (!modifiedCurrentUrl || !slug) return false;
  return trimSlashes(modifiedCurrentUrl) === trimSlashes(slug);
};
