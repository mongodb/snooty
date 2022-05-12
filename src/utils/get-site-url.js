const { baseUrl } = require('./base-url');

// Given a project's `name`, return its base URL.
const getSiteUrl = (project, needsPrefix = false) => {
  let url = 'https://docs.mongodb.com';
  switch (project) {
    case 'cloud-docs':
      url = 'https://docs.atlas.mongodb.com';
      break;
    case 'mms':
      url = 'https://docs.opsmanager.mongodb.com';
      break;
    default:
  }
  return baseUrl(url, { needsPrefix });
};

module.exports.getSiteUrl = getSiteUrl;
