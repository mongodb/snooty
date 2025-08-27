const assertLeadingSlash = (url) => {
  if (!url) return '/';
  return '/' + url.replace(/^\/+/, '');
};

module.exports.assertLeadingSlash = assertLeadingSlash;
