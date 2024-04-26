import { baseUrl } from './base-url';
import { assertTrailingSlash } from './assert-trailing-slash';
import { removeLeadingSlash } from './remove-leading-slash';

export const getCompleteBreadcrumbData = ({ siteTitle, slug, queriedCrumbs, parentPaths }) => {
  //get intermediate breadcrumbs and property Url
  const propertyUrl = assertTrailingSlash(queriedCrumbs?.propertyUrl);
  const intermediateCrumbs = (queriedCrumbs?.breadcrumbs ?? []).map((crumb) => {
    return { ...crumb, url: assertTrailingSlash(baseUrl() + removeLeadingSlash(crumb.url)) };
  });

  const homeCrumb = {
    title: 'Docs Home',
    url: baseUrl(),
  };

  // If site is the property homepage, leave the propertyCrumb blank
  let propertyCrumb;
  if (slug !== '/') {
    propertyCrumb = {
      title: siteTitle,
      url: propertyUrl,
    };
  }

  //get direct parents of the current page from parentPaths
  //add respective url to each direct parent crumb
  const parents = (parentPaths[slug] ?? []).map((crumb) => {
    return { ...crumb, url: assertTrailingSlash(propertyUrl + removeLeadingSlash(crumb.path)) };
  });

  return propertyCrumb
    ? [homeCrumb, ...intermediateCrumbs, propertyCrumb, ...parents]
    : [homeCrumb, ...intermediateCrumbs, ...parents];
};
