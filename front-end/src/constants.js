const LANGUAGES = [
  {
    name: 'shell',
    value: 'Mongo Shell',
  },
  {
    name: 'compass',
    value: 'Compass',
  },
  {
    name: 'python',
    value: 'Python',
  },
  {
    name: 'java-sync',
    value: 'Java (Sync)',
  },
  {
    name: 'nodejs',
    value: 'Node.js',
  },
  {
    name: 'php',
    value: 'PHP',
  },
  {
    name: 'motor',
    value: 'Motor',
  },
  {
    name: 'java-async',
    value: 'Java (Async)',
  },
  {
    name: 'c',
    value: 'C',
  },
  {
    name: 'cpp',
    value: 'C++11',
  },
  {
    name: 'csharp',
    value: 'C#',
  },
  {
    name: 'perl',
    value: 'Perl',
  },
  {
    name: 'ruby',
    value: 'Ruby',
  },
  {
    name: 'scala',
    value: 'Scala',
  },
];

const OSTABS = [
  {
    name: 'windows',
    value: 'Windows',
  },
  {
    name: 'macOS',
    value: 'macOS',
  },
  {
    name: 'linux',
    value: 'Linux',
  },
];

const DEPLOYMENTS = [
  {
    name: 'cloud',
    value: 'Cloud',
  },
  {
    name: 'local',
    value: 'Local',
  },
];

// hardcoded for now because this target lookup will be complex
// as it relies on other sites (e.g. manual) cc. Andrew
const REF_TARGETS = {
  'compass-index': 'https://docs.mongodb.com/compass/current/#compass-index',
  'document-dot-notation': 'https://docs.mongodb.com/manual/core/document/#document-dot-notation',
  'mongodb-uri': 'https://docs.mongodb.com/manual/reference/connection-string/#mongodb-uri',
  'mongodb-supported-platforms': 'https://docs.mongodb.com/manual/installation/#mongodb-supported-platforms',
};

export { LANGUAGES, OSTABS, DEPLOYMENTS, REF_TARGETS };
