import React from 'react';
import PropTypes from 'prop-types';
import { HeaderContextProvider } from './header-context';
import { NavigationProvider } from './navigation-context';
import { SidenavContextProvider } from './sidenav-context';
import { TabProvider } from './tab-context';

const RootProvider = ({ children, isSidenavEnabled, selectors }) => (
  <TabProvider selectors={selectors}>
    <HeaderContextProvider>
      <NavigationProvider>
        <SidenavContextProvider isSidenavEnabled={isSidenavEnabled}>{children}</SidenavContextProvider>
      </NavigationProvider>
    </HeaderContextProvider>
  </TabProvider>
);

RootProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  isSidenavEnabled: PropTypes.bool,
  selectors: PropTypes.object,
};

export default RootProvider;
