import { compareBranchesWithVersionNumbers } from './compare-branches-with-version-numbers';

const PROPERTY_MAPPING = {
  atlas: 'Atlas',
  'bi-connector': 'BI Connector',
  charts: 'Charts',
  compass: 'Compass',
  'database-tools': 'Database Tools',
  datalake: 'Datalake',
  'docs-php-library': 'PHP Driver',
  'docs-ruby': 'Ruby Driver',
  drivers: 'Drivers',
  ecosystem: 'Ecosystem',
  guides: 'Guides',
  'kafka-connector': 'Kafka Connector',
  'kubernetes-operator': 'Kubernetes Operator',
  manual: 'MongoDB Manual',
  'mms-cloud': 'MMS Cloud',
  'mms-onprem': 'MMS On Prem',
  mongocli: 'MongoDB CLI',
  'mongodb-vscode': 'MongoDB VSCode',
  mongoid: 'mongoid',
  realm: 'Realm',
  'spark-connector': 'Spark Connector',
};

const capitalizeString = s => s.charAt(0).toUpperCase() + s.slice(1);

export const getSortedBranchesForProperty = (parsedManifest, property) => {
  const branches = Object.keys(parsedManifest[property]);
  branches.sort(compareBranchesWithVersionNumbers);
  return branches;
};

export const parseMarianManifest = manifest => {
  // Parse the format <property name>-<branch name>, where branch name is
  // expected to be any alphanumeric character or a '.' and property name is
  // unrestricted
  const [, name, branch] = manifest.match(/(.*)-([\w.]*)$/);
  // If manifest is not captured above, fallback to capitalizing each word
  const property =
    PROPERTY_MAPPING[name] ||
    name
      .split('-')
      .map(capitalizeString)
      .join(' ');
  return { branch, property };
};

// Parses a list of manifest strings from Marian
export const parseMarianManifests = manifests => {
  const result = {};
  manifests.forEach(m => {
    const { branch, property } = parseMarianManifest(m);
    if (!(property in result)) {
      result[property] = {};
    }
    result[property][branch] = m;
  });
  // This result is malformed "Charts 19-06" and seems duplicated by 'Charts 19.06'
  delete result['Charts 19'];
  return result;
};
