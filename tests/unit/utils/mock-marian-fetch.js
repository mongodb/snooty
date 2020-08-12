const allowJsonPromise = x => ({ json: () => x });

export const mockMarianFetch = url => {
  let endpoint = url;
  if (endpoint.includes('https://marian.mongodb.com/')) {
    endpoint = endpoint.split('https://marian.mongodb.com/')[1];
  }
  switch (endpoint) {
    case 'status':
      return allowJsonPromise({ manifests: ['realm-master'] });
    case 'search?q=stitch':
      return allowJsonPromise({
        results: [{ title: 'stitch (no filters)', preview: 'Stitch preview (no filters)', url: 'stitch.nofilters' }],
      });
    case 'search?q=stitch&searchProperty=realm-master':
      return allowJsonPromise({
        results: [
          { title: 'stitch (realm filter)', preview: 'Stitch preview (with realm filter)', url: 'stitch.withfilters' },
        ],
      });

    default:
      return allowJsonPromise(['atlas-master']);
  }
};
