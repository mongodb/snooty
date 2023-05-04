import { Variant } from '@leafygreen-ui/badge';

export const changeTypeBadge = {
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
