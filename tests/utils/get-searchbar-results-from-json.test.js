import { getSearchbarResultsFromJSON } from '../../src/utils/get-searchbar-results-from-json';

it('Properly parses a Marian Title (to remove properties)', () => {
  const sampleDocTitle = 'Sample Title';
  const samplePreview = 'preview';
  const sampleResponse = { results: [{ title: `${sampleDocTitle} — MongoDB Stitch`, preview: samplePreview }] };
  const result = getSearchbarResultsFromJSON(sampleResponse)[0];
  expect(result.title).toBe(sampleDocTitle);
  expect(result.preview).toBe(samplePreview);
});

it('Returns a specified number of results', () => {
  const sampleDocTitle = 'Sample Title';
  const samplePreview = 'preview';
  const sampleResponse = {
    results: Array(10).fill({ title: `${sampleDocTitle} — MongoDB Stitch`, preview: samplePreview }),
  };
  const result = getSearchbarResultsFromJSON(sampleResponse, 3);
  expect(result.length).toBe(3);
});
