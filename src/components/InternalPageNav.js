import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { getPageTitle } from '../utils/get-page-title';

const InternalPageNav = ({ slug, slugTitleMapping, toctreeOrder }) => {
  const slugIndex = toctreeOrder.indexOf(slug);
  const prevSlug = slugIndex > 0 ? toctreeOrder[slugIndex - 1] : null;
  const nextSlug = slugIndex < toctreeOrder.length - 1 ? toctreeOrder[slugIndex + 1] : null;
  return (
    <div id="btnv">
      {prevSlug && (
        <React.Fragment>
          <span className="btn-arrow-left">← &nbsp;</span>
          <a className="btn-prev-text" href={withPrefix(prevSlug)} title="Previous Section">
            <span>{getPageTitle(prevSlug, slugTitleMapping)}</span>
          </a>
        </React.Fragment>
      )}
      {nextSlug && (
        <React.Fragment>
          <a className="btn-next-text" href={withPrefix(nextSlug)} title="Next Section">
            <span>{getPageTitle(nextSlug, slugTitleMapping)}</span>
          </a>
          <span className="btn-arrow-right">&nbsp;→</span>
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
