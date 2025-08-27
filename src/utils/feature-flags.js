export function getFeatureFlags() {
  return {
    isUnifiedToc: process.env.GATSBY_USE_UNIFIED_TOC === 'true' ? true : false,
  };
}
