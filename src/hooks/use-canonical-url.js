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
  const pathPrefix = generateVersionedPrefix(siteBasePrefix, urlSlug);

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
    // lets stop here because a canonical from a directive is highest ranked
    return canonical;
  }

  // else we check for EOL
  if (metadata.eol && metadata.canonical) {
    // if a canonical is provided by the writers
    canonical = metadata.canonical;
  }

  canonical = assertTrailingSlash(canonical);
  return canonical;
};
