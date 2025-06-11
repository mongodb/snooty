import { assertTrailingSlash } from '../utils/assert-trailing-slash';
import { normalizePath } from '../utils/normalize-path';
import { generateVersionedPrefix } from '../utils/generate-versioned-prefix';
import { PageContextRepoBranches, RemoteMetadata } from '../types/data';
import { MetaNode } from '../types/ast';
import { useSiteMetadata } from './use-site-metadata';

export const useCanonicalUrl = (
  meta: MetaNode[],
  metadata: RemoteMetadata,
  slug: string,
  repoBranches: PageContextRepoBranches
) => {
  const siteMetadata = useSiteMetadata();
  const { siteUrl, parserBranch } = siteMetadata;
  // Use parserBranch by default to avoid undefined slugs when testing
  const urlSlug =
    repoBranches?.branches.find((branch) => branch.gitBranchName === parserBranch)?.urlSlug ?? parserBranch;
  const siteBasePrefix = repoBranches?.siteBasePrefix;
  const pathPrefix = generateVersionedPrefix(siteBasePrefix, urlSlug);

  // Use default logic assuming there is no canonical provided from the meta directive
  let canonical = `${siteUrl}${normalizePath(`${pathPrefix}/${slug === '/' ? '' : slug}`)}`;

  // Check to see if the canonical is provided from the meta directive
  const canonicalMeta = meta.find((m) => typeof m.options?.canonical === 'string');

  if (canonicalMeta) {
    // a canonical from a directive is highest ranked
    return canonicalMeta.options.canonical;
  }

  // else we check for EOL
  if (metadata.eol && metadata.canonical) {
    // if a canonical is provided by the writers
    canonical = metadata.canonical;
  }

  canonical = assertTrailingSlash(canonical);
  return canonical;
};
