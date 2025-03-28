import { assertLeadingSlash } from '../../utils/assert-leading-slash';
import { removeTrailingSlash } from '../../utils/remove-trailing-slash';

// Goes through toc.toml and builds parent breadcrumb data for each entry
export const createParentFromToc = (item, breadcrumbs) => {
  const newCrumbs = [...breadcrumbs];
  if (item.url) {
    item.breadcrumbs = [...breadcrumbs];
    const newBreadCrumb = {};
    newBreadCrumb.path = assertLeadingSlash(removeTrailingSlash(item.url));
    newBreadCrumb.title = item.label;
    newCrumbs.push(newBreadCrumb);
  }

  if (item.items) {
    for (const nestItem of item.items) {
      createParentFromToc(nestItem, newCrumbs);
    }
  }

  return;
};

// Finds breadcrumb through slug
export const findParentBreadCrumb = (slug, tocTree) => {
  for (const item of tocTree) {
    if (assertLeadingSlash(removeTrailingSlash(item.url)) === assertLeadingSlash(removeTrailingSlash(slug))) {
      return item.breadcrumbs;
    }

    if (item.items) {
      const result = findParentBreadCrumb(slug, item.items);
      if (result) return result;
    }
  }

  return null;
};
