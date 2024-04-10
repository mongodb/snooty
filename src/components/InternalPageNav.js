import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import { getPageTitle } from '../utils/get-page-title';
import Link from './Link';

const StyledContainer = styled.div`
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

const arrowStyling = css`
  line-height: 28px;
  align-content: center;
  color: ${palette.black};
`;

const titleSpanStyling = css`
  line-height: 28px;
`;

const LinkContentContainer = styled.div`
  display: flex;
  column-gap: ${theme.size.tiny};
`;

const InternalPageNav = ({ slug, slugTitleMapping, toctreeOrder }) => {
  const slugIndex = toctreeOrder.indexOf(slug);
  const prevSlug = slugIndex > 0 ? toctreeOrder[slugIndex - 1] : null;
  const nextSlug = slugIndex < toctreeOrder.length - 1 ? toctreeOrder[slugIndex + 1] : null;
  return (
    <StyledContainer>
      {prevSlug && (
        <React.Fragment>
          <LinkContentContainer>
            <span className={cx([arrowStyling])}>←&nbsp;</span>
            <Link className={cx(titleSpanStyling)} to={prevSlug} title="Previous Section">
              {getPageTitle(prevSlug, slugTitleMapping)}
            </Link>
          </LinkContentContainer>
        </React.Fragment>
      )}
      {nextSlug && (
        <React.Fragment>
          <LinkContentContainer>
            <Link className={cx(titleSpanStyling)} to={nextSlug} title="Next Section">
              {getPageTitle(nextSlug, slugTitleMapping)}
            </Link>
            <span className={cx([arrowStyling])}>&nbsp;→</span>
          </LinkContentContainer>
        </React.Fragment>
      )}
    </StyledContainer>
  );
};

InternalPageNav.propTypes = {
  slug: PropTypes.string.isRequired,
  slugTitleMapping: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string]))
    .isRequired,
  toctreeOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default InternalPageNav;
