import { dotcomifyUrl, isDotCom } from './utils/dotcom';

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
    if (isDotCom()) value = dotcomifyUrl(value);
    return [key, value];
  })
);

export const DOCS_URL = 'https://mongodb.com/docs/';
export const MARIAN_URL = 'https://docs-search-transport.mongodb.com/';
