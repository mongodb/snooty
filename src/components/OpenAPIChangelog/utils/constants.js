import { Variant } from '@leafygreen-ui/badge';

export const ALL_VERSIONS = 'ALL_VERSIONS';
export const COMPARE_VERSIONS = 'COMPARE_VERSIONS';

export const getChangeTypeBadge = {
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
