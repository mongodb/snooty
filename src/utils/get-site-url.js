// Given a project's `name`, return its base URL.
const getSiteUrl = (project) => {
  let url = 'https://www.mongodb.com/docs';
  switch (project) {
    case 'cloud-docs':
      url = 'https://www.mongodb.com/docs/atlas';
      break;
    case 'mms':
      url = 'https://www.mongodb.com/docs/ops-manager';
      break;
    default:
  }
  return url;
};

module.exports.getSiteUrl = getSiteUrl;
