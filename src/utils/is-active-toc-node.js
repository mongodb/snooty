// import { isCurrentPage } from './is-current-page';
// import { isUnifiedTocActive } from './is-unified-toc-active';
// import { getFeatureFlags } from './feature-flags';

// /*
//   Provided a current page slug, a slug, and a list of node children, returns
//   true if either the given slug matches the current page slug or one of its children
//   has a slug matching the given page slug, and false otherwise.
// */
// export const isActiveTocNode = (currentUrl, slug, children) => {
//   const { isUnifiedToc } = getFeatureFlags();
//   // This is used to handle active links for local and preview builds for the
//   // Unified TOC and is only enabled right now if the feature flag is on.
//   if (isUnifiedToc && isUnifiedTocActive(slug)) return true;
//   if (currentUrl === undefined) return false;
//   if (isCurrentPage(currentUrl, slug)) return true;
//   if (children) {
//     return children.reduce((a, b) => a || isActiveTocNode(currentUrl, b.url, b.items), false);
//   }
//   return false;
// };
