const transformBreadcrumbs = (breadcrumbs, slugToBreadcrumbLabel) => {
  Object.entries(breadcrumbs).forEach(([slug, breadcrumbList]) => {
    breadcrumbs[slug] = breadcrumbList.map((path) => {
      const title = slugToBreadcrumbLabel?.[path] || '';
      return {
        path,
        title,
      };
    });
  });
};

module.exports = { transformBreadcrumbs };
