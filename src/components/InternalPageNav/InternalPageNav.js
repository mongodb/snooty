import React, { useContext } from 'react';
import PropTypes from 'prop-types';
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
import NextPrevLink from './NextPrevLink';

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
`;

const prevStyle = css`
  margin-right: auto;
`;

const nextStyle = css`
  margin-left: auto;
`;

const getActiveTutorialPage = (activeTutorial, key, linkTitle) => {
  return {
    targetSlug: activeTutorial[key].targetSlug,
    pageTitle: activeTutorial[key].pageTitle,
    linkTitle,
  };
};

const getTocPage = (targetSlug, slugTitleMapping, linkTitle) => {
  return {
    targetSlug,
    pageTitle: targetSlug ? getPageTitle(targetSlug, slugTitleMapping) : null,
    linkTitle,
  };
};

const getPrev = (activeTutorial, toctreeOrder, slugTitleMapping, slugIndex) => {
  const key = 'prev';
  if (activeTutorial?.[key]) {
    return getActiveTutorialPage(activeTutorial, key, 'Previous Step');
  }
  const prevSlug = slugIndex > 0 ? toctreeOrder[slugIndex - 1] : null;
  return getTocPage(prevSlug, slugTitleMapping, 'Previous Section');
};

const getNext = (activeTutorial, toctreeOrder, slugTitleMapping, slugIndex) => {
  const key = 'next';
  if (activeTutorial?.[key]) {
    return getActiveTutorialPage(activeTutorial, key, 'Next Step');
  }
  const nextSlug = slugIndex < toctreeOrder.length - 1 ? toctreeOrder[slugIndex + 1] : null;
  return getTocPage(nextSlug, slugTitleMapping, 'Next Section');
};

// Replacing the version in the pathPrefix with `:version` to match toc.json urls
function replaceVersionInPath(pathPrefix, versions) {
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

function groupContainsUrl(items, currentUrl) {
  for (const item of items) {
    if (removeTrailingSlash(item.url) === removeTrailingSlash(currentUrl)) return true;
    if (item.items && groupContainsUrl(item.items, currentUrl)) return true;
  }
  return false;
}

function findGroupForUrl(toc, currentUrl) {
  for (const L1Item of toc) {
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

function flattenGroupItems(items, flat = []) {
  for (const item of items) {
    if (item.isExternal) {
      // Skips external links
      continue;
    }

    if (item.url) {
      flat.push({
        label: item.label,
        url: item.url,
        contentSite: item.contentSite,
      });
    }
    if (item.items) {
      flattenGroupItems(item.items, flat);
    }
  }
  return flat;
}

// Allows InternalNavLinks to be between different contentSites if needed
function getTargetSlug(fullUrl, contentSite, activeVersions, availableVersions) {
  if (!fullUrl.includes(':version')) {
    return fullUrl;
  } else {
    const version = (availableVersions[contentSite] || []).find(
      (version) => version.gitBranchName === activeVersions[contentSite]
    );
    // If no version use first version.urlSlug in the list, or if no version loads, set as current
    const defaultVersion = availableVersions[contentSite]?.[0].urlSlug ?? 'current';
    const currentVersion = version?.urlSlug ?? defaultVersion;
    return fullUrl.replace(/:version/g, currentVersion);
  }
}

function getPrevUnified(toc, currentUrl, activeVersions, availableVersions) {
  const group = findGroupForUrl(toc, currentUrl);
  if (!group) return null;

  const flat = flattenGroupItems(group.items || []);
  const index = flat.findIndex((item) => removeTrailingSlash(item.url) === removeTrailingSlash(currentUrl));

  const node = index > 0 ? flat[index - 1] : null;

  return {
    targetSlug: node ? getTargetSlug(node.url, node.contentSite, activeVersions, availableVersions) : null,
    pageTitle: node ? node.label : null,
    contentSite: node ? node.contentSite : null,
    linkTitle: 'Previous Section',
  };
}

function getNextUnified(toc, currentUrl, activeVersions, availableVersions) {
  const group = findGroupForUrl(toc, currentUrl);
  if (!group) return null;

  const flat = flattenGroupItems(group.items || []);
  const index = flat.findIndex((item) => removeTrailingSlash(item.url) === removeTrailingSlash(currentUrl));

  const node = index >= 0 && index < flat.length - 1 ? flat[index + 1] : null;

  return {
    targetSlug: node ? getTargetSlug(node.url, node.contentSite, activeVersions, availableVersions) : null,
    pageTitle: node ? node.label : null,
    contentSite: node ? node.contentSite : null,
    linkTitle: 'Next Section',
  };
}

const InternalPageNav = ({ slug, slugTitleMapping, toctreeOrder }) => {
  const { isUnifiedToc } = getFeatureFlags();
  const tocTree = useUnifiedToc();
  const { pathPrefix, project } = useSiteMetadata();
  const { availableVersions, activeVersions } = useContext(VersionContext);
  const noVersionPathPrefix = replaceVersionInPath(pathPrefix, availableVersions[project]);
  const fullSlug = slug === '/' ? noVersionPathPrefix : assertTrailingSlash(noVersionPathPrefix) + slug;
  const activeTutorial = useActiveMpTutorial();
  const slugIndex = toctreeOrder.indexOf(slug);

  const prevPage = isUnifiedToc
    ? getPrevUnified(tocTree, fullSlug, activeVersions, availableVersions)
    : getPrev(activeTutorial, toctreeOrder, slugTitleMapping, slugIndex);
  const nextPage = isUnifiedToc
    ? getNextUnified(tocTree, fullSlug, activeVersions, availableVersions)
    : getNext(activeTutorial, toctreeOrder, slugTitleMapping, slugIndex);

  const handleClick = (direction, targetSlug) => {
    reportAnalytics('InternalPageNavClicked', {
      direction,
      targetSlug,
    });
  };

  return (
    <div className={cx(containerStyling)}>
      {prevPage?.targetSlug && (
        <NextPrevLink
          className={prevStyle}
          icon={glyphs.ArrowLeft.displayName}
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
          icon={glyphs.ArrowRight.displayName}
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

InternalPageNav.propTypes = {
  slug: PropTypes.string.isRequired,
  slugTitleMapping: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string]))
    .isRequired,
  toctreeOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default InternalPageNav;
