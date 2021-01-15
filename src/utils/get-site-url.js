// Given a project's `name`, return its base URL.
const getSiteUrl = project => {
  switch (project) {
    case 'cloud-docs':
      return 'https://docs.atlas.mongodb.com';
    case 'mms':
      return 'https://docs.opsmanager.mongodb.com';
    default:
      return 'https://docs.mongodb.com';
  }
};

module.exports.getSiteUrl = getSiteUrl;
