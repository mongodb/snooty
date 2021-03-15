export const LANGUAGES = [
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

export const DEPLOYMENTS = ['cloud', 'local'];

export const PLATFORMS = ['windows', 'macos', 'linux', 'debian', 'rhel'];

export const SLUG_TO_STRING = {
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

export const stringifyTab = (tabName) => {
  return SLUG_TO_STRING[tabName] || tabName;
};

// hardcoded for now because this target lookup will be complex
// as it relies on other sites (e.g. manual) cc. Andrew
export const REF_TARGETS = {
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
  'configuration-options': 'https://docs.mongodb.com/manual/reference/configuration-options/#configuration-options',
};

export const DOCS_URL = 'https://docs.mongodb.com';
export const MARIAN_URL = 'https://marian.mongodb.com';

export const SUGGESTION_WHITELIST = [
  'tutorial/install-mongodb-on-windows',
  'tutorial/install-mongodb-on-ubuntu',
  'tutorial/query-documents',
  'reference/method/db.collection.find',
  'reference/method/db.collection.updateOne',
];

export const REF_LABELS = {
  'install-rhel-configure-selinux': 'Configure SELinux',
  'write-op-insert-behavior': 'Insert Behavior',
};

export const SECTION_NAME_MAPPING = {
  prerequisites: {
    id: 'what-you-ll-need',
    title: 'What You’ll Need',
  },
  check_your_environment: {
    id: 'check-your-environment',
    title: 'Check Your Environment',
  },
  procedure: {
    id: 'procedure',
    title: 'Procedure',
  },
  summary: { id: 'summary', title: 'Summary' },
  whats_next: {
    id: 'what-s-next',
    title: 'What’s Next',
  },
  seealso: {
    id: 'see-also',
    title: 'See Also',
  },
};

export const URL_SLUGS = {
  server: ['docs'],
  drivers: ['drivers', 'mongoid', 'node', 'php-library', 'ruby-driver'],
  cloud: ['cloud-docs', 'datalake', 'mms', 'realm'],
  tools: [
    'bi-connector',
    'charts',
    'compass',
    'database-tools',
    'kafka-connector',
    'k8s-operator',
    'mongocli',
    'mongodb-shell',
    'mongodb-vscode',
    'spark-connector',
  ],
  guides: ['guides'],
};

export const ENABLED_SITES_FOR_DELIGHTED = ['cloud-docs', 'datalake', 'docs', 'guides', 'manual', 'node', 'realm'];
