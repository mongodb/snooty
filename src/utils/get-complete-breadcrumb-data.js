import { baseUrl } from './base-url';
import { assertTrailingSlash } from './assert-trailing-slash';
import { removeLeadingSlash } from './remove-leading-slash';

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
    url: baseUrl(),
  };

  // If a pageTitle prop is passed, use that as the property breadcrumb instead
  const propertyCrumb =
    slug !== '/'
      ? [
          {
            title: siteTitle,
            url: '/',
          },
        ]
      : [];
  //get intermediate breadcrumbs and property Url

  const propertyUrl = assertTrailingSlash(queriedCrumbs?.propertyUrl);
  const intermediateCrumbs = (queriedCrumbs?.breadcrumbs ?? []).map((crumb) => {
    return { ...crumb, url: assertTrailingSlash(baseUrl() + removeLeadingSlash(crumb.url)) };
  });

  //if the current page is a property homepage, leave the propertyCrumb as an empty array
  if (propertyCrumb.length) {
    propertyCrumb[0].url = propertyUrl;
  }
  //get direct parents of the current page from parentPaths
  //add respective url to each direct parent crumb
  const parents = (parentPaths[slug] ?? []).map((crumb) => {
    return { ...crumb, url: assertTrailingSlash(propertyUrl + removeLeadingSlash(crumb.path)) };
  });

  return [homeCrumb, ...intermediateCrumbs, ...propertyCrumb, ...parents];
};
