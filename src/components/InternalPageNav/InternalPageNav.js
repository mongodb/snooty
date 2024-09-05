import React from 'react';
import PropTypes from 'prop-types';
import { glyphs } from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import { getPageTitle } from '../../utils/get-page-title';
import { useActiveMPTutorial } from '../../hooks/use-active-mp-tutorial';
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

const getPrev = (activeTutorial, toctreeOrder, slugTitleMapping, slugIndex) => {
  if (activeTutorial?.prev) {
    return {
      prevSlug: activeTutorial.prev.targetSlug,
      prevPageTitle: activeTutorial.prev.pageTitle,
      prevLinkTitle: 'Previous Step',
    };
  }

  const prevSlug = slugIndex > 0 ? toctreeOrder[slugIndex - 1] : null;
  return {
    prevSlug: prevSlug,
    prevPageTitle: prevSlug ? getPageTitle(prevSlug, slugTitleMapping) : null,
    prevLinkTitle: 'Previous Section',
  };
};

const getNext = (activeTutorial, toctreeOrder, slugTitleMapping, slugIndex) => {
  if (activeTutorial?.next) {
    return {
      nextSlug: activeTutorial.next.targetSlug,
      nextPageTitle: activeTutorial.next.pageTitle,
      nextLinkTitle: 'Next Step',
    };
  }

  const nextSlug = slugIndex < toctreeOrder.length - 1 ? toctreeOrder[slugIndex + 1] : null;
  return {
    nextSlug: nextSlug,
    nextPageTitle: nextSlug ? getPageTitle(nextSlug, slugTitleMapping) : null,
    nextLinkTitle: 'Next Section',
  };
};

const InternalPageNav = ({ slug, slugTitleMapping, toctreeOrder }) => {
  const activeTutorial = useActiveMPTutorial();
  const slugIndex = toctreeOrder.indexOf(slug);
  const prevPage = getPrev(activeTutorial, toctreeOrder, slugTitleMapping, slugIndex);
  const nextPage = getNext(activeTutorial, toctreeOrder, slugTitleMapping, slugIndex);

  return (
    <div className={cx(containerStyling)}>
      {prevPage?.prevSlug && (
        <NextPrevLink
          icon={glyphs.ArrowLeft.displayName}
          direction="Back"
          targetSlug={prevPage.prevSlug}
          pageTitle={prevPage.prevPageTitle}
          title={prevPage.prevLinkTitle}
        />
      )}
      {nextPage?.nextSlug && (
        <NextPrevLink
          icon={glyphs.ArrowRight.displayName}
          direction="Next"
          targetSlug={nextPage.nextSlug}
          pageTitle={nextPage.nextPageTitle}
          title={nextPage.nextLinkTitle}
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
