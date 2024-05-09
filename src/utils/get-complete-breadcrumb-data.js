import { withPrefix } from 'gatsby';
import { baseUrl } from './base-url';
import { assertTrailingSlash } from './assert-trailing-slash';
import { removeLeadingSlash } from './remove-leading-slash';
import { assertLeadingSlash } from './assert-leading-slash';
import { isRelativeUrl } from './is-relative-url';

const nodesToString = (titleNodes) => {
  if (typeof titleNodes === 'string') {
    return titleNodes;
  }

  if (!titleNodes) {
    return titleNodes;
  }

  return titleNodes
    .map((node) => {
      if (node.type === 'text') {
        return node.value;
      }

      return nodesToString(node.children);
    })
    .join('');
};

export const getFullBreadcrumbPath = (path, needsPrefix) => {
  if (needsPrefix) {
    path = withPrefix(path);
  }
  if (isRelativeUrl(path)) {
    path = baseUrl() + removeLeadingSlash(path);
  }
  return assertTrailingSlash(path);
};

export const getCompleteBreadcrumbData = ({ siteTitle, slug, queriedCrumbs, parentPaths }) => {
  //get intermediate breadcrumbs
  const intermediateCrumbs = (queriedCrumbs?.breadcrumbs ?? []).map((crumb) => {
    return { ...crumb, path: getFullBreadcrumbPath(crumb.path, false) };
  });

  const homeCrumb = {
    title: 'Docs Home',
    path: baseUrl(),
  };

  // If site is the property homepage, leave the propertyCrumb blank
  let propertyCrumb;
  if (slug !== '/') {
    propertyCrumb = {
      title: nodesToString(siteTitle),
      path: '/',
    };
  }

  //get direct parents of the current page from parentPaths
  //add respective url to each direct parent crumb
  const parents = (parentPaths[slug] ?? []).map((crumb) => {
    return {
      ...crumb,
      title: nodesToString(crumb.title),
      path: assertLeadingSlash(crumb.path),
    };
  });

  return propertyCrumb
    ? [homeCrumb, ...intermediateCrumbs, propertyCrumb, ...parents]
    : [homeCrumb, ...intermediateCrumbs, ...parents];
};
