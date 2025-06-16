import React from 'react';
import PropTypes from 'prop-types';
import { glyphs } from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import { getPageTitle } from '../../utils/get-page-title';
import { useActiveMpTutorial } from '../MultiPageTutorials';
import { reportAnalytics } from '../../utils/report-analytics';
import { SlugToTitle } from '../../types/data';
import { ActiveTutorial } from '../MultiPageTutorials/hooks/use-active-mp-tutorial';
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

const getActiveTutorialPage = (activeTutorial: ActiveTutorial, key: 'next' | 'prev', linkTitle: string) => {
  return {
    targetSlug: activeTutorial[key]?.targetSlug,
    pageTitle: activeTutorial[key]?.pageTitle ?? '',
    linkTitle,
  };
};

const getTocPage = (targetSlug: string | null, slugTitleMapping: SlugToTitle, linkTitle: string) => {
  return {
    targetSlug,
    pageTitle: targetSlug ? getPageTitle(targetSlug, slugTitleMapping) ?? '' : '',
    linkTitle,
  };
};

const getPrev = (
  activeTutorial: ActiveTutorial | undefined,
  toctreeOrder: string[],
  slugTitleMapping: SlugToTitle,
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
  slugTitleMapping: SlugToTitle,
  slugIndex: number
) => {
  const key = 'next';
  if (activeTutorial?.[key]) {
    return getActiveTutorialPage(activeTutorial, key, 'Next Step');
  }
  const nextSlug = slugIndex < toctreeOrder.length - 1 ? toctreeOrder[slugIndex + 1] : null;
  return getTocPage(nextSlug, slugTitleMapping, 'Next Section');
};

export type InternalPageNavProps = {
  slug: string;
  slugTitleMapping: SlugToTitle;
  toctreeOrder: string[];
};

const InternalPageNav = ({ slug, slugTitleMapping, toctreeOrder }: InternalPageNavProps) => {
  const activeTutorial = useActiveMpTutorial();
  const slugIndex = toctreeOrder.indexOf(slug);
  const prevPage = getPrev(activeTutorial, toctreeOrder, slugTitleMapping, slugIndex);
  const nextPage = getNext(activeTutorial, toctreeOrder, slugTitleMapping, slugIndex);

  const handleClick = (direction: string, targetSlug: string) => {
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
          icon={glyphs.ArrowLeft.displayName ?? 'ArrowLeft'}
          direction="Back"
          targetSlug={prevPage.targetSlug}
          pageTitle={prevPage.pageTitle}
          title={prevPage.linkTitle}
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
