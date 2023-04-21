import { compareBranchesWithVersionNumbers } from './compare-branches-with-version-numbers';

const locatedOutdatedTemporaryFile = (outDatedManifest) => {
  return ['manual-manual', 'manual-upcoming'].includes(outDatedManifest);
};

const setAliasesKey = {
  'manual-upcoming': 'manual-v6.3',
  'manual-manual': 'manual-v6.2',
};

export const getSortedBranchesForProperty = (parsedManifest, property) => {
  const branches = Object.keys(parsedManifest[property]);
  branches.sort(compareBranchesWithVersionNumbers);
  return branches;
};

// Parses a list of manifest strings from Marian
export const parseMarianManifests = (manifests, searchPropertyMapping = {}) => {
  const result = {};

  console.log('manifest', manifests);
  console.log('searchPropertyMapping', searchPropertyMapping);

  manifests.forEach((manifest) => {
    // Temporarily handling Aliases for manual-manual and manual-master
    // We should only include categories and versions in the filter dropdowns if they
    // have category/version data associated with them. This will prevent unexpected
    // or new manifests without proper titles from appearing in the dropdowns.
    if (!searchPropertyMapping[manifest] && !locatedOutdatedTemporaryFile(manifest)) {
      return;
    }

    const key = setAliasesKey[manifest] ? setAliasesKey[manifest] : manifest;
    const { categoryTitle: category, versionSelectorLabel: version } = searchPropertyMapping[key];
    // organize by property / category (ex. { Atlas : { Latest : atlas-master }})
    if (!(category in result)) {
      result[category] = {};
    }
    result[category][version] = manifest;
  });

  console.log('result', result);

  return result;
};
