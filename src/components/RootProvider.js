import React from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import { HeaderContextProvider } from './header-context';
import { ContentsProvider } from './contents-context';
import { SidebarContextProvider } from './sidebar-context';
import { TabProvider } from './tab-context';

const NavigationProvider = loadable(() => import('./navigation-context'), {
  resolveComponent: (components) => components.NavigationProvider,
});

const RootProvider = ({ children, headingNodes, isSidebarEnabled, selectors, siteTitle }) => (
  <TabProvider selectors={selectors}>
    <ContentsProvider headingNodes={headingNodes}>
      <HeaderContextProvider>
        <NavigationProvider siteTitle={siteTitle}>
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
