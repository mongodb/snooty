const { getPlaintext } = require('../get-plaintext');

const transformBreadcrumbs = (breadcrumbs, slugToTitle) => {
  Object.entries(breadcrumbs).forEach(([slug, breadcrumbList]) => {
    breadcrumbs[slug] = breadcrumbList.map((path) => {
      const title = slugToTitle?.[path] || [];
      return {
        path,
        title,
        plaintext: getPlaintext(title),
      };
    });
  });
};

module.exports = { transformBreadcrumbs };
