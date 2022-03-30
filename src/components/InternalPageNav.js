import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import Link from './Link';
import { getPageTitle } from '../utils/get-page-title';

const tableContainerStyling = css`
  padding-top: 2em;
  padding-bottom: 2.5em;
  display: table;
  width: 100%;

  @media print {
    display: none;
  }
`;

const tableCellStyling = css`
  display: table-cell;
  vertical-align: middle;
`;

const textAlignLeft = css`
  text-align: left;
`;

const textAlignRight = css`
  text-align: right;
`;

const titleSpanStyling = css`
  display: inline-block;
  width: 270px;
`;

const InternalPageNav = ({ slug, slugTitleMapping, toctreeOrder }) => {
  const slugIndex = toctreeOrder.indexOf(slug);
  const prevSlug = slugIndex > 0 ? toctreeOrder[slugIndex - 1] : null;
  const nextSlug = slugIndex < toctreeOrder.length - 1 ? toctreeOrder[slugIndex + 1] : null;
  return (
    <div css={tableContainerStyling}>
      {prevSlug && (
        <React.Fragment>
          <span css={[tableCellStyling, textAlignRight]}>← &nbsp;</span>
          <Link css={[tableCellStyling, textAlignLeft]} to={prevSlug} title="Previous Section">
            <span css={titleSpanStyling}>{getPageTitle(prevSlug, slugTitleMapping)}</span>
          </Link>
        </React.Fragment>
      )}
      {nextSlug && (
        <React.Fragment>
          <Link css={[tableCellStyling, textAlignRight]} to={nextSlug} title="Next Section">
            <span css={titleSpanStyling}>{getPageTitle(nextSlug, slugTitleMapping)}</span>
          </Link>
          <span css={[tableCellStyling, textAlignLeft]}>&nbsp;→</span>
        </React.Fragment>
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
