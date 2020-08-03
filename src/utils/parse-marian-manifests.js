import { compareBranchesWithVersionNumbers } from './compare-branches-with-version-numbers';

const PROPERTY_MAPPING = {
  'Bi Connector': 'BI Connector',
  'Docs Php Library': 'PHP Driver',
  'Docs Ruby': 'Ruby Driver',
  Manual: 'MongoDB Manual',
  'Mms Cloud': 'MMS Cloud',
  'Mms Onprem': 'MMS On Prem',
  'Mongodb Vscode': 'MongoDB VSCode',
};

const capitalizeString = s => s.charAt(0).toUpperCase() + s.slice(1);

export const getSortedBranchesForProperty = (parsedManifest, property) => {
  const branches = Object.keys(parsedManifest[property]);
  branches.sort(compareBranchesWithVersionNumbers);
  return branches;
};

// Parses a list of manifest strings from Marian
export const parseMarianManifests = manifests => {
  const result = {};
  manifests.forEach(m => {
    const splitManifest = m.split('-');
    // below also destructively removes last element
    const branch = splitManifest.pop();
    const property = splitManifest.map(capitalizeString).join(' ');
    const formattedPropertyName = PROPERTY_MAPPING[property] || property;
    if (!(formattedPropertyName in result)) {
      result[formattedPropertyName] = {};
    }
    result[formattedPropertyName][branch] = m;
  });
  // This result is malformed "Charts 19-06" and seems duplicated by 'Charts 19.06'
  delete result['Charts 19'];
  return result;
};
