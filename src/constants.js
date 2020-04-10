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

export const stringifyTab = tabName => {
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

export const PROPERTY_NAME_MAPPING = {
  manual: 'MongoDB Server',
  cloud: 'MongoDB Atlas',
  compass: 'MongoDB Compass',
  charts: 'MongoDB Charts',
  atlas_open_service_broker: 'MongoDB Atlas Open Service Broker on Kubernetes',
  k8s_operator: 'MongoDB Enterprise Kubernetes Operator',
  mms: 'MongoDB Ops Manager',
  bi_connector: 'MongoDB Connector for BI',
  spark_connector: 'MongoDB Connector for Spark',
  kafka_connector: 'MongoDB Kafka Connector',
  mongoid: 'Mongoid',
  ecosystem: 'MongoDB Ecosystem',
  ruby_driver: 'Ruby MongoDB Driver',
};

export const ADMONITIONS = ['admonition', 'example', 'important', 'note', 'seealso', 'tip', 'warning'];

export const URL_SLUGS = {
  server: ['manual', 'master', 'v3.6', 'v3.4', 'v3.2', 'v3.0', 'v2.6', 'v2.4', 'v2.2'],
  drivers: ['ecosystem', 'ruby-driver', 'mongoid'],
  cloud: ['cloud', 'stitch'],
  tools: ['tools', 'bi-connector', 'charts', 'compass', 'kubernetes-operator', 'spark-connector'],
  guides: ['guides'],
};

export const URL_SUBDOMAINS = {
  cloud: ['atlas', 'cloudmanager', 'opsmanager'],
};
