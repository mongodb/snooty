import React from 'react';
import PropTypes from 'prop-types';
import { glyphs } from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import { getPageTitle } from '../../utils/get-page-title';
import { useActiveMpTutorial } from '../MultiPageTutorials';
import { reportAnalytics } from '../../utils/report-analytics';
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

const InternalPageNav = ({ slug, slugTitleMapping, toctreeOrder }) => {
  const activeTutorial = useActiveMpTutorial();
  const slugIndex = toctreeOrder.indexOf(slug);
  const prevPage = getPrev(activeTutorial, toctreeOrder, slugTitleMapping, slugIndex);
  const nextPage = getNext(activeTutorial, toctreeOrder, slugTitleMapping, slugIndex);

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
          icon={glyphs.ArrowLeft.displayName}
          direction="Back"
          targetSlug={prevPage.targetSlug}
          pageTitle={prevPage.pageTitle}
          title={prevPage.linkTitle}
          onClick={handleClick}
        />
      )}
      {nextPage?.targetSlug && (
        <NextPrevLink
          icon={glyphs.ArrowRight.displayName}
          direction="Next"
          targetSlug={nextPage.targetSlug}
          pageTitle={nextPage.pageTitle}
          title={nextPage.linkTitle}
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
