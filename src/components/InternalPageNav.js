import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import StyledLink from './StyledLink';
import { getPageTitle } from '../utils/get-page-title';

const NavContainer = styled('nav')`
  display: flex;
  justify-content: space-between;
`;

const InternalPageNav = ({ slug, slugTitleMapping, toctreeOrder }) => {
  const slugIndex = toctreeOrder.indexOf(slug);
  const prevSlug = slugIndex > 0 ? toctreeOrder[slugIndex - 1] : null;
  const nextSlug = slugIndex < toctreeOrder.length - 1 ? toctreeOrder[slugIndex + 1] : null;
  return (
    <NavContainer>
      <div>
        {prevSlug && (
          <>
            ←&nbsp;
            <StyledLink to={prevSlug} title="Previous Section">
              {getPageTitle(prevSlug, slugTitleMapping)}
            </StyledLink>
          </>
        )}
      </div>
      <div>
        {nextSlug && (
          <>
            <StyledLink to={nextSlug} title="Next Section">
              {getPageTitle(nextSlug, slugTitleMapping)}
            </StyledLink>
            &nbsp;→
          </>
        )}
      </div>
    </NavContainer>
  );
};

InternalPageNav.propTypes = {
  slug: PropTypes.string.isRequired,
  slugTitleMapping: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string]))
    .isRequired,
  toctreeOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default InternalPageNav;
