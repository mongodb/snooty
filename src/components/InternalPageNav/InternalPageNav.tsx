import React, { useContext } from 'react';
import { glyphs } from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import { getPageTitle } from '../../utils/get-page-title';
import { useActiveMpTutorial } from '../MultiPageTutorials';
import { reportAnalytics } from '../../utils/report-analytics';
import { getFeatureFlags } from '../../utils/feature-flags';
import { useUnifiedToc } from '../../hooks/use-unified-toc';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { VersionContext } from '../../context/version-context';
import { removeTrailingSlash } from '../../utils/remove-trailing-slash';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { SlugToBreadcrumbLabel, SlugToTitle } from '../../types/data';
import { ActiveTutorial } from '../MultiPageTutorials/hooks/use-active-mp-tutorial';
import { TocItem } from '../UnifiedSidenav/types';
import { BranchData } from '../../types/data';
import type { ActiveVersions, AvailableVersions } from '../../context/version-context';
import { currentScrollPosition } from '../../utils/current-scroll-position';
import NextPrevLink from './NextPrevLink';

interface FlatItem {
  label: string;
  url?: string;
  contentSite?: string;
  group?: boolean;
  versions?: {
    includes?: string[];
    excludes?: string[];
  };
}

const containerStyling = css`
  padding-bottom: 2.5em;
  width: 100%;
  display: flex;
  justify-content: space-between;
  column-gap: ${theme.size.default};
  margin-top: 88px;

  @media ${theme.screenSize.upToSmall} {
    flex-direction: column-reverse;
    row-gap: 64px;
    margin-top: 66px;
  }

  @media print {
    display: none;
  }

  a {
    text-decoration: none;
  }
`;

const prevStyle = css`
  margin-right: auto;
`;

const nextStyle = css`
  margin-left: auto;
`;

const getActiveTutorialPage = (
  activeTutorial: ActiveTutorial,
  key: 'next' | 'prev',
  linkTitle: string
): {
  targetSlug: string | null;
  pageTitle: string | null;
  contentSite: string | null;
  linkTitle: string;
} => {
  return {
    targetSlug: activeTutorial[key]?.targetSlug ?? null,
    pageTitle: activeTutorial[key]?.pageTitle ?? null,
    contentSite: null,
    linkTitle,
  };
};

const getTocPage = (
  targetSlug: string | null,
  slugTitleMapping: SlugToTitle | SlugToBreadcrumbLabel,
  linkTitle: string
): {
  targetSlug: string | null;
  pageTitle: string | null;
  contentSite: string | null;
  linkTitle: string;
} => {
  return {
    targetSlug,
    pageTitle: targetSlug ? String(getPageTitle(targetSlug, slugTitleMapping) ?? '') : '',
    linkTitle,
    contentSite: null,
  };
};

const getPrev = (
  activeTutorial: ActiveTutorial | undefined,
  toctreeOrder: string[],
  slugTitleMapping: SlugToTitle | SlugToBreadcrumbLabel,
  slugIndex: number
) => {
  const key = 'prev';
  if (activeTutorial?.[key]) {
    return getActiveTutorialPage(activeTutorial, key, 'Previous Step');
  }
  const prevSlug = slugIndex > 0 ? toctreeOrder[slugIndex - 1] : null;
  return getTocPage(prevSlug, slugTitleMapping, 'Previous Section');
};

const getNext = (
  activeTutorial: ActiveTutorial | undefined,
  toctreeOrder: string[],
  slugTitleMapping: SlugToTitle | SlugToBreadcrumbLabel,
  slugIndex: number
) => {
  const key = 'next';
  if (activeTutorial?.[key]) {
    return getActiveTutorialPage(activeTutorial, key, 'Next Step');
  }
  const nextSlug = slugIndex < toctreeOrder.length - 1 ? toctreeOrder[slugIndex + 1] : null;
  return getTocPage(nextSlug, slugTitleMapping, 'Next Section');
};

// Replacing the version in the pathPrefix with `:version` to match toc.json urls
function replaceVersionInPath(pathPrefix: string, versions?: BranchData[]): string {
  if (!versions) return pathPrefix;

  const segments = pathPrefix.split('/');
  const lastSegment = segments[segments.length - 1] || segments[segments.length - 2];
  const matchesVersion = versions.find(
    (version) => version.urlSlug === lastSegment || (version.urlAliases && version.urlAliases.includes(lastSegment))
  );

  if (matchesVersion) {
    segments[segments.length - 1] = ':version/';
    if (segments[segments.length - 1] === '') {
      segments[segments.length - 2] = ':version/'; // If the last was empty due to trailing slash
      segments.pop();
    }
    return segments.join('/');
  }

  return pathPrefix;
}

function groupContainsUrl(items: TocItem[], currentUrl: string): boolean {
  for (const item of items) {
    if (item.url && removeTrailingSlash(item.url) === removeTrailingSlash(currentUrl)) return true;
    if (item.items && groupContainsUrl(item.items, currentUrl)) return true;
  }
  return false;
}

function findGroupForUrl(toc: TocItem[], currentUrl: string): TocItem | null {
  for (const L1Item of toc) {
    if (!L1Item.items) continue;
    for (const item of L1Item.items) {
      if (item.group) {
        if (groupContainsUrl(item.items || [], currentUrl)) {
          return item;
        }
      }
    }
  }
  return null;
}

function flattenGroupItems(
  items: TocItem[],
  flat: FlatItem[] = [],
  parentVersions?: { includes?: string[]; excludes?: string[] }
): FlatItem[] {
  for (const item of items) {
    if (item.isExternal) {
      // Skips external links
      continue;
    }

    // Inherit parent's version constraints if child doesn't have its own
    const effectiveVersions = item.versions || parentVersions;

    flat.push({
      label: item.label,
      url: item.url,
      contentSite: item.contentSite,
      group: item.group,
      versions: effectiveVersions,
    });

    if (item.items) {
      flattenGroupItems(item.items, flat, effectiveVersions);
    }
  }
  return flat;
}

// Allows InternalNavLinks to be between different contentSites if needed
function getTargetSlug(
  fullUrl: string,
  contentSite: string | undefined,
  activeVersions: ActiveVersions,
  availableVersions: AvailableVersions
): string {
  if (!fullUrl.includes(':version') || !contentSite) {
    return fullUrl;
  } else {
    const version = (availableVersions[contentSite] || []).find(
      (version) =>
        version.gitBranchName === activeVersions[contentSite] ||
        version.urlSlug === activeVersions[contentSite] ||
        version?.urlAliases?.includes(activeVersions[contentSite])
    );

    // If no version found in local storage use 'current'
    const currentVersion = version?.urlSlug ?? 'current';
    return fullUrl.replace(/:version/g, currentVersion);
  }
}

// Function to check if node is displayed in the current version
function isNodeValidForVersion(
  node: FlatItem,
  activeVersions: ActiveVersions,
  availableVersions: AvailableVersions
): boolean {
  if (!node.url) return false; // If no URL, not valid
  if (!node.versions) return true; // If no versions constraint, always valid
  if (!node.contentSite) return false; // This is case shouldn't exist, but just in case
  if (node.url.includes('http')) return false; // If external link, not valid for internal page navigation

  const contentSite = node.contentSite;
  const activeVersion = (availableVersions[contentSite] || []).find(
    (version) =>
      version.gitBranchName === activeVersions[contentSite] ||
      version.urlSlug === activeVersions[contentSite] ||
      version?.urlAliases?.includes(activeVersions[contentSite])
  );

  // Check excludes first - if active version is excluded, node is invalid
  if (node.versions.excludes && activeVersion) {
    if (node.versions.excludes.includes(activeVersion.urlSlug)) {
      return false;
    }
  }

  // Check includes - if includes array exists, active version must be in it
  if (node.versions.includes && activeVersion) {
    return node.versions.includes.includes(activeVersion.urlSlug);
  }

  // If only excludes exist and we passed that check, or no constraints
  return true;
}

function getPrevUnified(
  flattenedData: { flat: FlatItem[]; index: number } | null,
  activeVersions: ActiveVersions,
  availableVersions: AvailableVersions
): {
  targetSlug: string | null;
  pageTitle: string | null;
  contentSite: string | undefined | null;
  linkTitle: string;
} | null {
  if (!flattenedData) return null;
  const { flat, index } = flattenedData;

  let node: FlatItem | null = null;
  for (let i = index - 1; i >= 0; i--) {
    const candidate = flat[i];

    if (candidate.group) {
      break;
    }

    if (isNodeValidForVersion(candidate, activeVersions, availableVersions)) {
      node = candidate;
      break;
    }
  }

  if (!node || !node.url) return null;

  return {
    targetSlug: getTargetSlug(node.url, node.contentSite, activeVersions, availableVersions),
    pageTitle: node.label,
    contentSite: node.contentSite,
    linkTitle: 'Previous Section',
  };
}

function getNextUnified(
  flattenedData: { flat: FlatItem[]; index: number } | null,
  activeVersions: ActiveVersions,
  availableVersions: AvailableVersions
): {
  targetSlug: string | null;
  pageTitle: string | null;
  contentSite: string | undefined | null;
  linkTitle: string;
} | null {
  if (!flattenedData) return null;
  const { flat, index } = flattenedData;

  let node: FlatItem | null = null;
  for (let i = index + 1; i < flat.length; i++) {
    const candidate = flat[i];

    if (candidate.group) {
      break;
    }

    if (isNodeValidForVersion(candidate, activeVersions, availableVersions)) {
      node = candidate;
      break;
    }
  }
  if (!node || !node.url) return null;

  return {
    targetSlug: getTargetSlug(node.url, node.contentSite, activeVersions, availableVersions),
    pageTitle: node.label,
    contentSite: node.contentSite,
    linkTitle: 'Next Section',
  };
}

const getFlattenedData = (
  toc: TocItem[],
  currentUrl: string,
  activeVersions: ActiveVersions,
  availableVersions: AvailableVersions
): { flat: FlatItem[]; index: number } | null => {
  const group = findGroupForUrl(toc, currentUrl);
  if (!group) return null;

  const flat = flattenGroupItems(group.items || []);

  // Find the index that matches URL and is valid for current version
  let index = -1;
  for (let i = 0; i < flat.length; i++) {
    const item = flat[i];
    if (item.url && removeTrailingSlash(item.url) === removeTrailingSlash(currentUrl)) {
      // If no versions constraint, this is the correct one
      if (!item.versions) {
        index = i;
        break;
      }
      // If has versions constraint, check if it's valid for current version
      if (isNodeValidForVersion(item, activeVersions, availableVersions)) {
        index = i;
        break;
      }
    }
  }

  return { flat, index };
};

export type InternalPageNavProps = {
  slug: string;
  slugTitleMapping: SlugToTitle | SlugToBreadcrumbLabel;
  toctreeOrder: string[];
};

const InternalPageNav = ({ slug, slugTitleMapping, toctreeOrder }: InternalPageNavProps) => {
  const { isUnifiedToc } = getFeatureFlags();
  const tocTree = useUnifiedToc();
  const { pathPrefix, project } = useSiteMetadata();
  const { availableVersions, activeVersions } = useContext(VersionContext);
  const noVersionPathPrefix = replaceVersionInPath(pathPrefix, availableVersions[project]);
  let fullSlug = slug === '/' ? noVersionPathPrefix : assertTrailingSlash(noVersionPathPrefix) + slug;
  const activeTutorial = useActiveMpTutorial();
  const slugIndex = toctreeOrder.indexOf(slug);

  const flattenedData = React.useMemo(() => {
    return isUnifiedToc ? getFlattenedData(tocTree, fullSlug, activeVersions, availableVersions) : null;
  }, [isUnifiedToc, tocTree, fullSlug, activeVersions, availableVersions]);

  const prevPage = isUnifiedToc
    ? getPrevUnified(flattenedData, activeVersions, availableVersions)
    : getPrev(activeTutorial, toctreeOrder, slugTitleMapping, slugIndex);
  const nextPage = isUnifiedToc
    ? getNextUnified(flattenedData, activeVersions, availableVersions)
    : getNext(activeTutorial, toctreeOrder, slugTitleMapping, slugIndex);

  const handleClick = (direction: string, targetSlug: string) => {
    reportAnalytics('CTA Click', {
      position: 'body',
      position_context: 'internal page nav',
      label: direction,
      scroll_position: currentScrollPosition(),
      tagbook: 'true',
    });
  };

  return (
    <div className={cx(containerStyling)}>
      {prevPage?.targetSlug && (
        <NextPrevLink
          className={prevStyle}
          icon={glyphs.ArrowLeft.displayName ?? 'ArrowLeft'}
          direction="Back"
          targetSlug={prevPage.targetSlug}
          pageTitle={prevPage.pageTitle}
          title={prevPage.linkTitle}
          contentSite={prevPage?.contentSite}
          onClick={handleClick}
        />
      )}
      {nextPage?.targetSlug && (
        <NextPrevLink
          className={nextStyle}
          icon={glyphs.ArrowRight.displayName ?? 'ArrowRight'}
          direction="Next"
          targetSlug={nextPage.targetSlug}
          pageTitle={nextPage.pageTitle}
          title={nextPage.linkTitle}
          contentSite={nextPage?.contentSite}
          onClick={handleClick}
        />
      )}
    </div>
  );
};

export default InternalPageNav;
