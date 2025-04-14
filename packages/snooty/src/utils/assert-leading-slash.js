export const assertLeadingSlash = (url) => {
  if (url && url.match(/^\//)) {
    return url;
  }
  return `/${url}`;
};
