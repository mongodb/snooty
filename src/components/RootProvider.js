import React from 'react';
import PropTypes from 'prop-types';
import { HeaderContextProvider } from './header-context';
import { NavigationProvider } from './navigation-context';
import { SidenavContextProvider } from './Sidenav';
import { TabProvider } from './tab-context';
import { ContentsProvider } from './contents-context';

const RootProvider = ({ children, headingNodes, isSidenavEnabled, selectors }) => (
  <TabProvider selectors={selectors}>
    <ContentsProvider headingNodes={headingNodes}>
      <HeaderContextProvider>
        <NavigationProvider>
          <SidenavContextProvider isSidenavEnabled={isSidenavEnabled}>{children}</SidenavContextProvider>
        </NavigationProvider>
      </HeaderContextProvider>
    </ContentsProvider>
  </TabProvider>
);

RootProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  headingNodes: PropTypes.arrayOf(PropTypes.object),
  isSidenavEnabled: PropTypes.bool,
  selectors: PropTypes.object,
};

export default RootProvider;
