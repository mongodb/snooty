import {
  getSortedBranchesForProperty,
  parseMarianManifest,
  parseMarianManifests,
} from '../../src/utils/parse-marian-manifests';
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

it('should properly parse a single marian manifest', () => {
  // This function is covered by testing parseMarianManifests but it is good to show a use case
  expect(parseMarianManifest('bi-connector-v2.0')).toStrictEqual({
    property: 'BI Connector',
    branch: 'v2.0',
  });
  // master has been mapped to "Latest"
  expect(parseMarianManifest('atlas-master')).toStrictEqual({
    property: 'Atlas',
    branch: 'Latest',
  });
  // current has been mapped to "Stable"
  expect(parseMarianManifest('atlas-current')).toStrictEqual({ property: 'Atlas', branch: 'Stable' });
});
