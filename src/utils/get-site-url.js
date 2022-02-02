const { isDotCom, dotcomifyUrl } = require('./dotcom');

// Given a project's `name`, return its base URL.
const getSiteUrl = (project) => {
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
  return isDotCom() ? dotcomifyUrl(url, true) : url;
};

module.exports.getSiteUrl = getSiteUrl;
