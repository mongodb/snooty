import React from 'react';
import styled from '@emotion/styled';
import { Link as GatsbyLink } from 'gatsby';
import { colorMap, size } from './theme';

const GlobalNav = styled('nav')`
  background: ${colorMap.greyDarkThree};
  color: ${colorMap.greyLightOne};
  display: flex;
  justify-content: space-around;
  padding: ${size.default};
`;
const Link = styled(GatsbyLink)`
  color: ${colorMap.greyLightOne};

  &[aria-current='page'] {
    color: ${colorMap.yellow};
  }
`;
const GlobalFooter = styled('footer')`
  background: ${colorMap.greyDarkThree};
  color: ${colorMap.greyLightOne};
  display: flex;
  justify-content: space-around;
`;

export default ({ children }) => (
  <div>
    <GlobalNav>
      <Link to="/dev-hub">Developers</Link>
      <Link to="/dev-hub/learn">Learn</Link>
      <Link to="/dev-hub/community">Community</Link>
    </GlobalNav>
    {children}
    <GlobalFooter>
      <ul>
        <li>footer item</li>
      </ul>
    </GlobalFooter>
  </div>
);
