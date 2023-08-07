import { Variant } from '@leafygreen-ui/badge';

export const ALL_VERSIONS = 'ALL_VERSIONS';
export const COMPARE_VERSIONS = 'COMPARE_VERSIONS';

export const getDownloadChangelogUrl = (runId) =>
  // `https://mongodb-mms-prod-build-server.s3.amazonaws.com/openapi/changelog/${runId}/changelog.json`;
  `https://mongodb-mms-build-server.s3.amazonaws.com/openapi/changelog/${runId}/changelog.json`;

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
