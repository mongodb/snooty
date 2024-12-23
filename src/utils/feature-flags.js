export function getFeatureFlags() {
  return {
    isUnifiedToc: Boolean(process.env.GATSBY_USE_UNIFIED_TOC),
  };
}
