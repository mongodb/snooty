import { Variant } from '@leafygreen-ui/badge';

export const ALL_VERSIONS = 'ALL_VERSIONS';
export const COMPARE_VERSIONS = 'COMPARE_VERSIONS';

export const getDownloadChangelogUrl = (snootyEnv) => {
  const branch = snootyEnv === 'staging' || snootyEnv === 'development' ? 'qa' : 'main';
  return `https://raw.githubusercontent.com/mongodb/openapi/${branch}/changelog/changelog.json`;
};

export const changeTypeBadges = {
  release: {
    variant: Variant.Green,
    label: 'Released',
  },
  deprecate: {
    variant: Variant.Red,
    label: 'Deprecated',
  },
  update: {
    variant: Variant.Green,
    label: 'Updated',
  },
  removed: {
    variant: Variant.Red,
    label: 'Removed',
  },
};
