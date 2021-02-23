import { MARIAN_URL } from '../../../src/constants';

const allowJsonPromise = (x) => ({ json: () => x });

export const FILTERED_RESULT = {
  title: 'stitch (realm filter)',
  preview: 'Stitch preview (with realm filter)',
  url: 'stitch.withfilters',
};

export const UNFILTERED_RESULT = {
  title: 'stitch (no filters)',
  preview: 'Stitch preview (no filters)',
  url: 'stitch.nofilters',
};

export const mockMarianFetch = (url) => {
  let endpoint = url;
  if (endpoint.includes(MARIAN_URL)) {
    endpoint = endpoint.split(`${MARIAN_URL}/`)[1];
  }
  switch (endpoint) {
    case 'status':
      return allowJsonPromise({ manifests: ['realm-master'] });
    case 'search?q=stitch':
      return allowJsonPromise({
        results: [UNFILTERED_RESULT],
      });
    case 'search?q=stitch&searchProperty=realm-master':
      return allowJsonPromise({
        results: [FILTERED_RESULT],
      });

    default:
      return allowJsonPromise(['atlas-master']);
  }
};
