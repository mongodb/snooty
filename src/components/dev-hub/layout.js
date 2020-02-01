import React from 'react';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import { Link as GatsbyLink } from 'gatsby';
import { colorMap, size } from './theme';

const globalStyles = css`
  body {
    background: ${colorMap.devBlack};
    color: ${colorMap.devWhite};
  }
`;

const GlobalWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: ${size.maxWidth};
  min-height: 100vh;
`;

const GlobalNav = styled('nav')`
  border-bottom: 1px solid ${colorMap.greyLightTwo};
  color: ${colorMap.greyLightOne};
  display: flex;
  justify-content: space-around;
  padding: ${size.default};
`;

const NavLink = styled(GatsbyLink)`
  color: ${colorMap.devWhite};
  padding: ${size.small};
  &[aria-current='page'] {
    background: ${colorMap.yellow};
    color: ${colorMap.greyDarkThree};
  }
`;

const GlobalFooter = styled('footer')`
  background: ${colorMap.devBlack};
  border-top: 1px solid ${colorMap.greyLightTwo};
  color: ${colorMap.greyLightOne};
  display: flex;
  justify-content: flex-start;
`;

const ContentWrapper = styled('main')`
  flex: 1;
`;

export default ({ children }) => (
  <GlobalWrapper>
    <Global styles={globalStyles} />
    <GlobalNav>
      <NavLink to="/dev-hub">Developers</NavLink>
      <NavLink to="/dev-hub/learn">Learn</NavLink>
      <NavLink to="/dev-hub/community">Community</NavLink>
    </GlobalNav>
    <ContentWrapper>{children}</ContentWrapper>
    <GlobalFooter>
      <ul>
        <li>footer item</li>
      </ul>
    </GlobalFooter>
  </GlobalWrapper>
);
