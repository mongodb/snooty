import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { SideNav as LeafygreenSideNav } from '@leafygreen-ui/side-nav';
import ProductsList from './ProductsList';

const StyledLeafygreenSideNav = styled(LeafygreenSideNav)`
  grid-area: sidebar;
  z-index: 1;
`;

const Sidenav = ({ page }) => {
  const showAllProducts = page?.options?.['nav-show-all-products'];

  return (
    <StyledLeafygreenSideNav aria-label="Side navigation">
      {showAllProducts && <ProductsList />}
    </StyledLeafygreenSideNav>
  );
};

Sidenav.propTypes = {
  page: PropTypes.shape({
    options: PropTypes.object,
  }).isRequired,
};

export default Sidenav;
