import { getSortedBranchesForProperty, parseMarianManifests } from '../../src/utils/parse-marian-manifests';
import mockInputData from './data/marian-manifests.json';
import mockResponseData from './data/parsed-marian-manifests.json';

it('should parse marian manifests', () => {
  expect(parseMarianManifests(mockInputData.manifests)).toStrictEqual(mockResponseData);
});

it('should properly sort branches for a property with version numbers', () => {
  const parsedSampleData = parseMarianManifests(mockInputData.manifests);
  expect(getSortedBranchesForProperty(parsedSampleData, 'Charts')).toStrictEqual([
    'current',
    'master',
    '19.12',
    '19.09',
    '19.06',
    'v0.12',
    'v0.11',
    'v0.10',
    'v0.9',
  ]);
});
