import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { UnifiedNav } from '@mdb/consistent-nav';
import Navbar from './Navbar';
import { SidenavMobileMenuDropdown } from './Sidenav';
import SiteBanner from './SiteBanner';
import { useSiteMetadata } from '../hooks/use-site-metadata';

const StyledHeaderContainer = styled.header`
  grid-area: header;
  z-index: 10;
`;

const Header = ({ sidenav }) => {
  const { project } = useSiteMetadata();
  const unifiedNavProperty = project === 'realm' ? 'REALM' : 'DOCS';

  return (
    <StyledHeaderContainer>
      <SiteBanner />
      <>
        <UnifiedNav position="relative" property={unifiedNavProperty} />
        {sidenav && <SidenavMobileMenuDropdown />}
      </>
    </StyledHeaderContainer>
  );
};

Header.propTypes = {
  sidenav: PropTypes.bool,
};

export default Header;
