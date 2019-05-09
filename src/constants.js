const LANGUAGES = [
  'shell',
  'compass',
  'python',
  'java-sync',
  'nodejs',
  'php',
  'motor',
  'java-async',
  'c',
  'cpp',
  'csharp',
  'perl',
  'ruby',
  'scala',
  'go',
];

const DEPLOYMENTS = ['cloud', 'local'];

const PLATFORMS = ['windows', 'macos', 'linux', 'debian', 'rhel'];

const SLUG_TO_STRING = {
  shell: 'Mongo Shell',
  compass: 'Compass',
  python: 'Python',
  javasync: 'Java (Sync)',
  'java-sync': 'Java (Sync)',
  nodejs: 'Node.js',
  php: 'PHP',
  motor: 'Motor',
  'java-async': 'Java (Async)',
  c: 'C',
  cpp: 'C++11',
  csharp: 'C#',
  perl: 'Perl',
  ruby: 'Ruby',
  scala: 'Scala',
  go: 'Go',
  cloud: 'Cloud',
  local: 'Local',
  macos: 'macOS',
  linux: 'Linux',
  windows: 'Windows',
  debian: 'Debian',
  rhel: 'RHEL',
};

const stringifyTab = tabName => {
  return SLUG_TO_STRING[tabName] || tabName;
};

// hardcoded for now because this target lookup will be complex
// as it relies on other sites (e.g. manual) cc. Andrew
const REF_TARGETS = {
  'compass-index': 'https://docs.mongodb.com/compass/current/#compass-index',
  'document-dot-notation': 'https://docs.mongodb.com/manual/core/document/#document-dot-notation',
  glossary: 'https://docs.mongodb.com/manual/reference/glossary',
  'install-rhel-configure-selinux':
    'https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/#install-rhel-configure-selinux',
  manual: 'https://docs.mongodb.com/manual',
  'mongodb-uri': 'https://docs.mongodb.com/manual/reference/connection-string/#mongodb-uri',
  'mongodb-supported-platforms': 'https://docs.mongodb.com/manual/installation/#mongodb-supported-platforms',
  'schema-validation-json': 'https://docs.mongodb.com/manual/core/schema-validation/#schema-validation-json',
  'write-op-insert-behavior': 'https://docs.mongodb.com/manual/tutorial/insert-documents/#insert-behavior',
};

const REF_LABELS = {
  'install-rhel-configure-selinux': 'Configure SELinux',
  'write-op-insert-behavior': 'Insert Behavior',
};

export { LANGUAGES, DEPLOYMENTS, PLATFORMS, REF_LABELS, REF_TARGETS, stringifyTab };
