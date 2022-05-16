// Changed to apply dotcom logic across each ref target, conditionally if we determine that we are building for dotcom
export const REF_TARGETS = {
  'compass-index': 'https://www.mongodb.com/docs/compass/current/#compass-index',
  'document-dot-notation': 'https://www.mongodb.com/docs/manual/core/document/#document-dot-notation',
  glossary: 'https://www.mongodb.com/docs/manual/reference/glossary',
  'install-rhel-configure-selinux':
    'https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/#install-rhel-configure-selinux',
  manual: 'https://www.mongodb.com/docs/manual',
  'mongodb-uri': 'https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-uri',
  'mongodb-supported-platforms': 'https://www.mongodb.com/docs/manual/installation/#mongodb-supported-platforms',
  'schema-validation-json': 'https://www.mongodb.com/docs/manual/core/schema-validation/#schema-validation-json',
  'write-op-insert-behavior': 'https://www.mongodb.com/docs/manual/tutorial/insert-documents/#insert-behavior',
  'configuration-options': 'https://www.mongodb.com/docs/manual/reference/configuration-options/#configuration-options',
};

export const MARIAN_URL = process.env.GATSBY_MARIAN_URL || 'https://docs-search-transport.mongodb.com/';

// Class names to be used by mut for search indexing
// https://github.com/mongodb/mut/blob/master/mut/index/Document.py#L68
export const MUT_CANDIDATES = {
  mainColumn: 'main-column',
};
