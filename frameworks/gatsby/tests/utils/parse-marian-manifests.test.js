import { getSortedBranchesForProperty, parseMarianManifests } from '../../src/utils/parse-marian-manifests';
import mockInputData from './data/marian-manifests.json';
import mockResponseData from './data/parsed-marian-manifests.json';

it('should parse marian manifests', () => {
  expect(parseMarianManifests(mockInputData.manifests, mockInputData.searchPropertyMapping)).toStrictEqual(
    mockResponseData
  );
});

it('should properly sort branches for a property with version numbers', () => {
  const parsedSampleData = parseMarianManifests(mockInputData.manifests, mockInputData.searchPropertyMapping);
  expect(getSortedBranchesForProperty(parsedSampleData, 'Mongoid')).toStrictEqual([
    'Latest',
    'Version 7.4 (current)',
    'Version 7.3',
  ]);
});
