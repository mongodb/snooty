import { MARIAN_URL } from '../../../src/constants';
import { statusV2 } from '../data/SearchResults.test.json';

const allowJsonPromise = (x) => ({ json: () => x });

export const FILTERED_RESULT = {
  title: 'stitch (realm filter)',
  preview: 'Stitch preview (with realm filter)',
  url: 'stitch.withfilters',
  searchProperty: ['realm-master'],
};

export const UNFILTERED_RESULT = {
  title: 'stitch (no filters)',
  preview: 'Stitch preview (no filters)',
  url: 'stitch.nofilters',
  searchProperty: ['realm-master'],
};

export const RESULT_ILL_FORMED_SEARCHPROPERTY = {
  title: 'realm (no filters)',
  preview: 'Realm preview (no filters)',
  url: 'realm.nofilters',
  searchProperty: ['realm-'],
};

export const mockMarianFetch = (url) => {
  let endpoint = url;
  if (endpoint.includes(MARIAN_URL)) {
    endpoint = endpoint.split(`${MARIAN_URL}`)[1];
  }
  switch (endpoint) {
    case 'status':
      return allowJsonPromise({ manifests: ['realm-master'] });
    case 'search?q=stitch&page=1':
      return allowJsonPromise({
        results: [UNFILTERED_RESULT],
      });
    case 'search?q=stitch&page=1&searchProperty=realm-master':
      return allowJsonPromise({
        results: [FILTERED_RESULT],
      });
    case 'search?q=realm':
      return allowJsonPromise({
        results: [RESULT_ILL_FORMED_SEARCHPROPERTY],
      });
    case 'v2/status':
      return allowJsonPromise(statusV2);
    case 'v2/search/meta?q=test&facets.genre=tutorial&facets.target_product>atlas>sub_product=atlas-cli':
      return allowJsonPromise({
        count: 99,
        facets: statusV2,
      });
    case 'v2/search/meta?q=test':
      return allowJsonPromise({
        count: 10,
        facets: statusV2,
      });
    default:
      return allowJsonPromise(['atlas-master']);
  }
};
