import React from 'react';
import PropTypes from 'prop-types';
import { glyphs } from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import { getPageTitle } from '../../utils/get-page-title';
import Link from '../Link';
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

const InternalPageNav = ({ slug, slugTitleMapping, toctreeOrder }) => {
  const slugIndex = toctreeOrder.indexOf(slug);
  const prevSlug = slugIndex > 0 ? toctreeOrder[slugIndex - 1] : null;
  const nextSlug = slugIndex < toctreeOrder.length - 1 ? toctreeOrder[slugIndex + 1] : null;
  return (
    <div className={cx(containerStyling)}>
      {prevSlug && (
        <Link to={prevSlug} title="Previous Section">
          <NextPrevLink
            icon={glyphs.ArrowLeft.displayName}
            direction="Back"
            pageTitle={getPageTitle(prevSlug, slugTitleMapping)}
          />
        </Link>
      )}
      {nextSlug && (
        <Link to={nextSlug} title="Next Section">
          <NextPrevLink
            icon={glyphs.ArrowRight.displayName}
            direction="Next"
            pageTitle={getPageTitle(nextSlug, slugTitleMapping)}
          />
        </Link>
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
