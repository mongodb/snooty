import React from 'react';
import PropTypes from 'prop-types';
import { ContentsProvider } from './contents-context';
import { HeaderContextProvider } from './header-context';
import { NavigationProvider } from './navigation-context';
import { SidebarContextProvider } from './sidebar-context';
import { TabProvider } from './tab-context';

const RootProvider = ({ children, headingNodes, isSidebarEnabled, pageTitle, selectors }) => (
  <TabProvider selectors={selectors}>
    <ContentsProvider headingNodes={headingNodes}>
      <HeaderContextProvider>
        <NavigationProvider pageTitle={pageTitle}>
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
  pageTitle: PropTypes.oneOf([PropTypes.string, PropTypes.arrayOf(PropTypes.object)]),
  selectors: PropTypes.object,
};

export default RootProvider;
