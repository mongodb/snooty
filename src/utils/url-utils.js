import { assertTrailingSlash } from './assert-trailing-slash';
import { joinUrlAndPath, DOTCOM_BASE_URL } from './base-url';
import { generateVersionedPrefix } from './generate-versioned-prefix';
import { localizePath } from './locale';

export const getUrl = (branchUrlSlug, project, siteBasePrefix, slug) => {
  if (branchUrlSlug === 'legacy') {
    // Avoid trailing slash to ensure query param remains valid
    const legacyPath = localizePath(`/docs/legacy/?site=${project}`);
    return DOTCOM_BASE_URL + legacyPath;
  }
  const prefixWithVersion = generateVersionedPrefix(branchUrlSlug, siteBasePrefix);
  return assertTrailingSlash(localizePath(`${prefixWithVersion}/${slug}`));
};

export const getCompleteUrl = (path) => {
  return joinUrlAndPath(DOTCOM_BASE_URL, path);
};
