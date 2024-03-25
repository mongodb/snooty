import { assertTrailingSlash } from '../utils/assert-trailing-slash';
import { useSiteMetadata } from './use-site-metadata';
//import { siteMetadata } from ''
import { generatePathPrefix } from '../utils/generate-path-prefix';
import { usePathPrefix } from './use-path-prefix';

export const useCanonicalUrl = (meta, metadata, slug, repoBranches) => {
  const siteMetadata = useSiteMetadata();
  // IDK WHAT TO DO
  const { siteUrl, parserBranch, project } = siteMetadata;
  // find urlslug
  //console.log(repoBranches);
  const urlSlugBranch = repoBranches.branches.find((branch) => branch.gitBranchName === parserBranch);
  console.log('BRANCH', urlSlugBranch);
  const urlSlug = urlSlugBranch.urlSlug;
  console.log('URL SLUG', urlSlug);
  //console.log(urlSlug);
  // TODO: What to put as default for project?
  const pathPrefix = generatePathPrefix(siteMetadata, project, urlSlug);
  //const generatePathPrefixe = generatePathPrefix(siteMetadata);
  //console.log('GENERATED PATH PREFIX', generatePathPrefixe);
  //const pathPrefix = usePathPrefix();

  // loop through repoBranches and find urlSlug for the current branch

  // console.log('SITE URL', siteUrl);
  // console.log('PATH FPREFIXXX', pathPrefix);
  // console.log('SLUG', slug);

  // repoBranches.branches.map((branch) => {
  //   if (branch.urlAliases && branch.urlAliases.length != 0) {
  //     console.log('BRANCH', branch);
  //     branch.urlAliases.map((alias) => {
  //       console.log('ALIAS', alias);
  //     });
  //   }
  // });
  // Use default logic assuming there is no canonical provided from the meta directive

  // AND THEN LOOP THROUGH REPOSBRANCHES TO FIND WHICH BRANCH WE"re ON< USE URLSLUG FOR THAT BRANCHHHH

  // RECONSTRUCT PATH PREFIX

  let canonical = `${siteUrl}${pathPrefix}/${slug === '/' ? '' : slug}`;

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
    const stableBranch = repoBranches.branches.find((branch) => {
      return branch.active && branch.isStableBranch;
    });

    if (stableBranch) {
      // if a stable branch is found, use the following canonical tag
      // which points to the most current version
      canonical = `${siteUrl}/${repoBranches.siteBasePrefix}/${stableBranch.urlSlug}`;
    } else {
      // this means the entire page is EoL'd and a writer should provide the canonical tag
      let _canonical = `${siteUrl}`;
      if (metadata.canonical) {
        _canonical = metadata.canonical;
      } else {
        console.warn(
          `${repoBranches.siteBasePrefix} seems to be an EoL'd product. A canonical URL should be provided in the snooty.toml`
        );
      }
      canonical = _canonical;
    }
  }

  canonical = assertTrailingSlash(canonical);
  return canonical;
};
