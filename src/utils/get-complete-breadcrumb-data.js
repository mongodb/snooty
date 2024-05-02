import { baseUrl } from './base-url';
import { assertLeadingSlash } from './assert-leading-slash';

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

export const getCompleteBreadcrumbData = ({ siteTitle, slug, queriedCrumbs, parentPaths }) => {
  //get intermediate breadcrumbs
  const intermediateCrumbs = queriedCrumbs?.breadcrumbs ?? [];

  const homeCrumb = {
    title: 'Docs Home',
    url: baseUrl(),
  };

  // If site is the property homepage, leave the propertyCrumb blank
  let propertyCrumb;
  if (slug !== '/') {
    propertyCrumb = {
      title: nodesToString(siteTitle),
      url: '/',
    };
  }

  //get direct parents of the current page from parentPaths
  //add respective url to each direct parent crumb
  const parents = (parentPaths[slug] ?? []).map((crumb) => {
    return {
      ...crumb,
      title: nodesToString(crumb.title),
      url: assertLeadingSlash(crumb.path),
    };
  });

  return propertyCrumb
    ? [homeCrumb, ...intermediateCrumbs, propertyCrumb, ...parents]
    : [homeCrumb, ...intermediateCrumbs, ...parents];
};
