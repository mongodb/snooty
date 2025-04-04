import { withPrefix } from 'gatsby';
import { baseUrl, joinUrlAndPath } from './base-url';
import { assertTrailingSlash } from './assert-trailing-slash';
import { assertLeadingSlash } from './assert-leading-slash';
import { isRelativeUrl } from './is-relative-url';
import { getUrl, getCompleteUrl } from './url-utils';

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

export const getFullBreadcrumbPath = (siteUrl, path, needsPrefix) => {
  if (isRelativeUrl(path)) {
    if (needsPrefix) {
      path = withPrefix(path);
    }
    path = joinUrlAndPath(siteUrl, path);
  }
  return assertTrailingSlash(path);
};

export const getSelfCrumbPath = (selfCrumbContent, urlSlug, project, siteBasePrefix) => {
  if (!project || !siteBasePrefix) return baseUrl();
  const isLanding = project === 'landing';
  if (!isLanding && selfCrumbContent)
    return getCompleteUrl(getUrl(urlSlug, project, siteBasePrefix, selfCrumbContent.slug));
  return selfCrumbContent?.slug ?? baseUrl();
};

export const getCompleteBreadcrumbData = ({
  siteUrl,
  siteTitle,
  slug,
  queriedCrumbs,
  parentPaths,
  selfCrumbContent = null,
  pageInfo = null,
  unifiedTocParents = null,
}) => {
  const { urlSlug, project, siteBasePrefix } = pageInfo || {};

  const isLanding = project === 'landing';

  //get intermediate breadcrumbs
  const intermediateCrumbs = (queriedCrumbs?.breadcrumbs ?? []).map((crumb) => {
    return { ...crumb, path: getFullBreadcrumbPath(siteUrl, crumb.path, false) };
  });

  const homeCrumb = {
    title: 'Docs Home',
    path: baseUrl(),
  };

  // If site is the property homepage, leave the propertyCrumb blank
  let propertyCrumb;
  if (slug !== '/') {
    const path = pageInfo && !isLanding ? getCompleteUrl(getUrl(urlSlug, project, siteBasePrefix, '/')) : '/';
    propertyCrumb = {
      title: nodesToString(siteTitle),
      path: path,
    };
  }

  //get direct parents of the current page from parentPaths
  //add respective url to each direct parent crumb
  const parents =
    unifiedTocParents ??
    (parentPaths ?? []).map((crumb) => {
      const path =
        pageInfo && !isLanding
          ? getCompleteUrl(getUrl(urlSlug, project, siteBasePrefix, crumb.path))
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
        path: getSelfCrumbPath(selfCrumbContent, urlSlug, project, siteBasePrefix),
      }
    : null;

  const almostFinalCrumbs = propertyCrumb
    ? [homeCrumb, ...intermediateCrumbs, propertyCrumb, ...parents]
    : [homeCrumb, ...intermediateCrumbs, ...parents];

  return selfCrumb ? [...almostFinalCrumbs, selfCrumb] : almostFinalCrumbs;
};
