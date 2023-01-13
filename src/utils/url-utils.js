import { generatePrefix } from '../components/VersionDropdown/utils';
import { baseUrl } from './base-url';
import { assertTrailingSlash } from './assert-trailing-slash';
import { normalizePath } from './normalize-path';

export const getUrl = (branchUrlSlug, project, siteMetadata, siteBasePrefix, slug) => {
  if (branchUrlSlug === 'legacy') {
    return `${baseUrl()}legacy/?site=${project}`;
  }
  const prefixWithVersion = generatePrefix(branchUrlSlug, siteMetadata, siteBasePrefix);
  return assertTrailingSlash(normalizePath(`${prefixWithVersion}/${slug}`));
};
