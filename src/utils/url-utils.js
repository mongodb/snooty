import { generatePrefix } from '../components/VersionDropdown/utils';
import { DOTCOM_BASE_URL } from './base-url';
import { localizePath } from './locale';

export const getUrl = (branchUrlSlug, project, siteMetadata, siteBasePrefix, slug) => {
  if (branchUrlSlug === 'legacy') {
    const legacyPath = localizePath(`/docs/legacy/?site=${project}`);
    return DOTCOM_BASE_URL + legacyPath;
  }
  const prefixWithVersion = generatePrefix(branchUrlSlug, siteMetadata, siteBasePrefix);
  return localizePath(`${prefixWithVersion}/${slug}`);
};
