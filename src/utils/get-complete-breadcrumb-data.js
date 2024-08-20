import { withPrefix } from 'gatsby';
import { baseUrl } from './base-url';
import { assertTrailingSlash } from './assert-trailing-slash';
import { removeLeadingSlash } from './remove-leading-slash';
import { assertLeadingSlash } from './assert-leading-slash';
import { isRelativeUrl } from './is-relative-url';
import { getUrl } from './url-utils';

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

export const getCompleteBreadcrumbData = ({
  siteTitle,
  slug,
  queriedCrumbs,
  parentPaths,
  selfCrumbContent = null,
  pageInfo = null,
}) => {
  const urlSlug = pageInfo?.urlSlug;
  const project = pageInfo?.project;
  const siteBasePrefix = pageInfo?.siteBasePrefix;

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
    const path = pageInfo ? getFullBreadcrumbPath(getUrl(urlSlug, project, siteBasePrefix, '/'), false) : '/';
    propertyCrumb = {
      title: nodesToString(siteTitle),
      path: path,
    };
  }

  //get direct parents of the current page from parentPaths
  //add respective url to each direct parent crumb
  const parents = (parentPaths[slug] ?? []).map((crumb) => {
    const path = pageInfo
      ? getFullBreadcrumbPath(getUrl(urlSlug, project, siteBasePrefix, crumb.path), false)
      : assertLeadingSlash(crumb.path);
    return {
      ...crumb,
      title: nodesToString(crumb.title),
      path: path,
    };
  });

  const selfCrumb = selfCrumbContent
    ? {
        title: selfCrumbContent.title,
        path: getFullBreadcrumbPath(getUrl(urlSlug, project, siteBasePrefix, selfCrumbContent.slug), false),
      }
    : null;

  const almostFinalCrumbs = propertyCrumb
    ? [homeCrumb, ...intermediateCrumbs, propertyCrumb, ...parents]
    : [homeCrumb, ...intermediateCrumbs, ...parents];

  return selfCrumb ? [...almostFinalCrumbs, selfCrumb] : almostFinalCrumbs;
};
