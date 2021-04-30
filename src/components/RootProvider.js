import React from 'react';
import PropTypes from 'prop-types';
import { ContentsProvider } from './contents-context';
import { HeaderContextProvider } from './header-context';
import { NavigationProvider } from './navigation-context';
import { SidebarContextProvider } from './sidebar-context';
import { TabProvider } from './tab-context';

const RootProvider = ({ children, headingNodes, isSidebarEnabled, selectors, siteTitle }) => (
  <TabProvider selectors={selectors}>
    <ContentsProvider headingNodes={headingNodes}>
      <HeaderContextProvider>
        <NavigationProvider>
          <SidebarContextProvider isSidebarEnabled={isSidebarEnabled}>{children}</SidebarContextProvider>
        </NavigationProvider>
      </HeaderContextProvider>
    </ContentsProvider>
  </TabProvider>
);

RootProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  headingNodes: PropTypes.arrayOf(PropTypes.object),
  isSidebarEnabled: PropTypes.bool,
  selectors: PropTypes.object,
  siteTitle: PropTypes.string,
};

export default RootProvider;
