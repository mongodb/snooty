import { baseUrl } from './base-url';
import { assertTrailingSlash } from './assert-trailing-slash';
import { removeLeadingSlash } from './remove-leading-slash';
import { assertLeadingSlash } from './assert-leading-slash';

export const getCompleteBreadcrumbData = ({
  homeUrl = null,
  pageTitle = null,
  siteTitle,
  slug,
  queriedCrumbs,
  parentPaths,
}) => {
  const homeCrumb = {
    title: 'Docs Home',
    url: homeUrl || baseUrl(),
  };
  // If a pageTitle prop is passed, use that as the property breadcrumb instead
  const propertyCrumb = {
    title: pageTitle || siteTitle,
    url: pageTitle ? slug : '/',
  };

  //get intermediate breadcrumbs and property Url

  const propertyUrl = assertTrailingSlash(queriedCrumbs?.propertyUrl);
  const intermediateCrumbs = queriedCrumbs?.breadcrumbs
    ? queriedCrumbs.breadcrumbs.map((crumb) => {
        return { ...crumb, url: `http://www.mongodb.com${assertLeadingSlash(crumb.url)}` };
      })
    : [];

  propertyCrumb.url = propertyUrl;

  //get direct parents of the current page from parentPaths
  //add respective url to each direct parent crumb
  const parents = parentPaths[slug]
    ? parentPaths[slug].map((crumb) => {
        return { title: crumb.plaintext, url: propertyUrl + removeLeadingSlash(crumb.path) };
      })
    : [];

  const breadcrumbs = [homeCrumb, ...intermediateCrumbs, propertyCrumb, ...parents];

  return breadcrumbs;
};
