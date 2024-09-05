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
      targetSlug: activeTutorial.prev.targetSlug,
      pageTitle: activeTutorial.prev.pageTitle,
      linkTitle: 'Previous Step',
    };
  }

  const prevSlug = slugIndex > 0 ? toctreeOrder[slugIndex - 1] : null;
  return {
    targetSlug: prevSlug,
    pageTitle: prevSlug ? getPageTitle(prevSlug, slugTitleMapping) : null,
    linkTitle: 'Previous Section',
  };
};

const getNext = (activeTutorial, toctreeOrder, slugTitleMapping, slugIndex) => {
  if (activeTutorial?.next) {
    return {
      targetSlug: activeTutorial.next.targetSlug,
      pageTitle: activeTutorial.next.pageTitle,
      linkTitle: 'Next Step',
    };
  }

  const nextSlug = slugIndex < toctreeOrder.length - 1 ? toctreeOrder[slugIndex + 1] : null;
  return {
    targetSlug: nextSlug,
    pageTitle: nextSlug ? getPageTitle(nextSlug, slugTitleMapping) : null,
    linkTitle: 'Next Section',
  };
};

const InternalPageNav = ({ slug, slugTitleMapping, toctreeOrder }) => {
  const activeTutorial = useActiveMPTutorial();
  const slugIndex = toctreeOrder.indexOf(slug);
  const prevPage = getPrev(activeTutorial, toctreeOrder, slugTitleMapping, slugIndex);
  const nextPage = getNext(activeTutorial, toctreeOrder, slugTitleMapping, slugIndex);

  return (
    <div className={cx(containerStyling)}>
      {prevPage?.targetSlug && (
        <NextPrevLink
          icon={glyphs.ArrowLeft.displayName}
          direction="Back"
          targetSlug={prevPage.targetSlug}
          pageTitle={prevPage.pageTitle}
          title={prevPage.linkTitle}
        />
      )}
      {nextPage?.targetSlug && (
        <NextPrevLink
          icon={glyphs.ArrowRight.displayName}
          direction="Next"
          targetSlug={nextPage.targetSlug}
          pageTitle={nextPage.pageTitle}
          title={nextPage.linkTitle}
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
