import { baseUrl, dotcomifyUrl, isDotCom } from './utils/dotcom';

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
const dotcomHandlingForREF_TARGETS = {
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

// Changed to apply dotcom logic across each ref target, conditionally if we determine that we are building for dotcom.
// TODO: remove after dotcom go live and update hardcoded links.
export const REF_TARGETS = Object.fromEntries(
  Object.entries(dotcomHandlingForREF_TARGETS).map(([key, value]) => {
    if (isDotCom()) value = dotcomifyUrl(value, true);
    return [key, value];
  })
);

export const DOCS_URL = baseUrl(true);
export const MARIAN_URL = 'https://docs-search-transport.mongodb.com';
export const LEGACY_URL = 'https://docs.mongodb.com/legacy/';
export const MARIAN_URL = 'https://marian.mongodb.com';

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
