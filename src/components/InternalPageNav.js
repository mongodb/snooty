import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';
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
          {/* TODO: Replace <a> with <Link> when back button behavior is fixed for the component.
              GitHub issue: https://github.com/gatsbyjs/gatsby/issues/8357 */}
          <Link className="btn-prev-text" to={prevSlug} title="Previous Section">
            <span>{getPageTitle(prevSlug, slugTitleMapping)}</span>
          </Link>
        </React.Fragment>
      )}
      {nextSlug && (
        <React.Fragment>
          <Link className="btn-next-text" to={nextSlug} title="Next Section">
            <span>{getPageTitle(nextSlug, slugTitleMapping)}</span>
          </Link>
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
