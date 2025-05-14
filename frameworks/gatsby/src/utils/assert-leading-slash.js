const assertLeadingSlash = (url) => {
  if (url && url.match(/^\//)) {
    return url;
  }
  return `/${url}`;
};

module.exports.assertLeadingSlash = assertLeadingSlash;
