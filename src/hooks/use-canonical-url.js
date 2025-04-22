import { assertTrailingSlash } from '../utils/assert-trailing-slash';
import { normalizePath } from '../utils/normalize-path';
import { generateVersionedPrefix } from '../utils/generate-versioned-prefix';
import { useSiteMetadata } from './use-site-metadata';

export const useCanonicalUrl = (meta, metadata, slug, repoBranches) => {
  const siteMetadata = useSiteMetadata();
  const { siteUrl, parserBranch } = siteMetadata;
  // Use parserBranch by default to avoid undefined slugs when testing
  const urlSlug =
    repoBranches?.branches.find((branch) => branch.gitBranchName === parserBranch)?.urlSlug ?? parserBranch;
  const siteBasePrefix = repoBranches?.siteBasePrefix;
  console.log('siteBasePrefix: ', repoBranches.siteBasePrefix);
  const pathPrefix = generateVersionedPrefix(urlSlug, siteBasePrefix);

  // Use default logic assuming there is no canonical provided from the meta directive
  let canonical = `${siteUrl}${normalizePath(`${pathPrefix}/${slug === '/' ? '' : slug}`)}`;

  // checks to see if the canonical is provided from the
  // meta directive and grab the index
  const canonicalIndex = Array.isArray(meta)
    ? meta.findIndex((_meta) => {
        return Object.hasOwn(_meta.options, 'canonical');
      })
    : -1;

  if (canonicalIndex !== -1) {
    canonical = meta[canonicalIndex].options.canonical;

    // after updating the canonical, we need to remove it from the
    // meta array because the canonical will be handle within
    meta.splice(canonicalIndex, 1);

    // lets stop here because a canonical from a directive is highest ranked
    return canonical;
  }

  // else we check for EOL
  if (metadata.eol) {
    const stableBranch = repoBranches?.branches.find((branch) => {
      return branch.active && branch.isStableBranch;
    });

    if (stableBranch) {
      // if a stable branch is found, use the following canonical tag
      // which points to the most current version
      canonical = `${siteUrl}/${normalizePath(`${siteBasePrefix}/${stableBranch.urlSlug}`)}`;
    } else {
      // this means the entire page is EoL'd and a writer should provide the canonical tag
      let _canonical = `${siteUrl}`;
      if (metadata.canonical) {
        _canonical = metadata.canonical;
      } else {
        console.warn(
          `${siteBasePrefix} seems to be an EoL'd product. A canonical URL should be provided in the snooty.toml`
        );
      }
      canonical = _canonical;
    }
  }

  canonical = assertTrailingSlash(canonical);
  return canonical;
};
