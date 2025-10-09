import { withPrefix } from 'gatsby';
import { QueriedCrumbs } from '../hooks/use-breadcrumbs';
import { PageInfo, SelfCrumb } from '../components/Breadcrumbs';
import { Node } from '../types/ast';
import { isParentNode, isTextNode } from '../types/ast-utils';
import { type BreadCrumb } from '../components/UnifiedSidenav/types';
import { baseUrl, joinUrlAndPath } from './base-url';
import { assertTrailingSlash } from './assert-trailing-slash';
import { assertLeadingSlash } from './assert-leading-slash';
import { isRelativeUrl } from './is-relative-url';
import { getUrl, getCompleteUrl } from './url-utils';
import { getFeatureFlags } from './feature-flags';

const nodesToString = (titleNodes: string | Array<Node>) => {
  if (typeof titleNodes === 'string') {
    return titleNodes;
  }

  if (!titleNodes) {
    return titleNodes;
  }

  return titleNodes
    .map((node: Node): string => {
      if (isTextNode(node)) {
        return node.value;
      } else if (isParentNode(node)) {
        return nodesToString(node.children);
      } else return '';
    })
    .join('');
};

export const getFullBreadcrumbPath = (siteUrl: string, path: string, needsPrefix: boolean) => {
  if (isRelativeUrl(path)) {
    if (needsPrefix) {
      path = withPrefix(path);
    }
    path = joinUrlAndPath(siteUrl, path);
  }
  return assertTrailingSlash(path);
};

export const getSelfCrumbPath = (
  selfCrumbContent: SelfCrumb,
  urlSlug?: string,
  project?: string,
  siteBasePrefix?: string
): string => {
  if (!project || !siteBasePrefix) return baseUrl();
  const isLanding = project === 'landing';
  if (!isLanding && selfCrumbContent)
    return getCompleteUrl(getUrl(urlSlug, project, siteBasePrefix, selfCrumbContent.slug));
  return selfCrumbContent?.slug ?? baseUrl();
};

type GetCompleteBreadcrumbDataProps = {
  siteUrl: string;
  siteTitle: string;
  slug: string;
  queriedCrumbs?: QueriedCrumbs;
  parentPaths?: Array<{ title: string; path: string }>;
  selfCrumbContent?: SelfCrumb;
  pageInfo?: PageInfo;
  unifiedTocParents?: BreadCrumb[] | undefined;
};

export const getCompleteBreadcrumbData = ({
  siteUrl,
  siteTitle,
  slug,
  queriedCrumbs,
  parentPaths,
  selfCrumbContent,
  pageInfo,
  unifiedTocParents,
}: GetCompleteBreadcrumbDataProps) => {
  const isLanding = pageInfo?.project === 'landing';
  const { isUnifiedToc } = getFeatureFlags();

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
    const path =
      pageInfo && !isLanding
        ? getCompleteUrl(getUrl(pageInfo.urlSlug, pageInfo.project, pageInfo.siteBasePrefix, '/'))
        : '/';
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
          ? getCompleteUrl(getUrl(pageInfo.urlSlug, pageInfo.project, pageInfo.siteBasePrefix, crumb.path))
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
        path: getSelfCrumbPath(selfCrumbContent, pageInfo?.urlSlug, pageInfo?.project, pageInfo?.siteBasePrefix),
      }
    : null;

  const almostFinalCrumbs = propertyCrumb
    ? [homeCrumb, ...intermediateCrumbs, propertyCrumb, ...parents]
    : [homeCrumb, ...intermediateCrumbs, ...parents];

  const unifiedTocCrumbs = [homeCrumb, ...parents];

  return isUnifiedToc ? unifiedTocCrumbs : selfCrumb ? [...almostFinalCrumbs, selfCrumb] : almostFinalCrumbs;
};
