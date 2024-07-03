import React from 'react';
import PropTypes from 'prop-types';
import Button from '@leafygreen-ui/button';
import { Body } from '@leafygreen-ui/typography';
import Icon, { glyphs } from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import { getPageTitle } from '../utils/get-page-title';
import Link from './Link';

const styledContainer = css`
  padding-top: 2em;
  padding-bottom: 2.5em;
  width: 100%;
  display: flex;
  justify-content: space-between;
  column-gap: ${theme.size.default};

  @media print {
    display: none;
  }
`;

const commonTextStyles = css`
  font-size: ${theme.fontSize.small};
  line-height: 20px;
`;

const commonNextPrevTextStyling = css`
  ${commonTextStyles}
  font-weight: 500;
`;

const nextTextStyling = css`
  ${commonNextPrevTextStyling}
  text-align: end;
`;

const prevTextStyling = css`
  ${commonNextPrevTextStyling}
  text-align: start;
`;

const nextPrevTitleTextStyling = css`
  ${commonTextStyles}
  color: ${palette.gray.base};
`;

const commonLinkContentContainer = css`
  align-items: center;
  display: flex;
  column-gap: 14px;
`;

const nextLinkContainer = css`
  ${commonLinkContentContainer}
  flex-direction: row-reverse;
`;

const prevLinkContainer = css`
  ${commonLinkContentContainer}
  flex-direction: row;
`;

const NextPrevLink = ({ icon, direction, pageTitle }) => {
  const isNext = direction?.toLowerCase() === 'next';
  const isPrev = direction?.toLowerCase() === 'back';

  return (
    <div className={cx({ [nextLinkContainer]: isNext, [prevLinkContainer]: isPrev })}>
      <Button size="large">
        <Icon glyph={icon} />
      </Button>
      <div>
        <Body className={cx({ [nextTextStyling]: isNext }, { [prevTextStyling]: isPrev })}>{direction}</Body>
        <Body className={cx(nextPrevTitleTextStyling)}>{pageTitle}</Body>
      </div>
    </div>
  );
};

const InternalPageNav = ({ slug, slugTitleMapping, toctreeOrder }) => {
  const slugIndex = toctreeOrder.indexOf(slug);
  const prevSlug = slugIndex > 0 ? toctreeOrder[slugIndex - 1] : null;
  const nextSlug = slugIndex < toctreeOrder.length - 1 ? toctreeOrder[slugIndex + 1] : null;
  return (
    <div className={cx(styledContainer)}>
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
