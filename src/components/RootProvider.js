import React from 'react';
import PropTypes from 'prop-types';
import { HeaderContextProvider } from './Header/header-context';
import { SidenavContextProvider } from './Sidenav';
import { TabProvider } from './Tabs/tab-context';
import { ContentsProvider } from './Contents/contents-context';
import { NavigationProvider } from '../context/navigation-context';
import { VersionContextProvider } from '../context/version-context';

const RootProvider = ({ children, headingNodes, selectors, repoBranches, associatedReposInfo }) => (
  <TabProvider selectors={selectors}>
    <ContentsProvider headingNodes={headingNodes}>
      <HeaderContextProvider>
        <VersionContextProvider repoBranches={repoBranches} associatedReposInfo={associatedReposInfo}>
          <NavigationProvider>
            <SidenavContextProvider>{children}</SidenavContextProvider>
          </NavigationProvider>
        </VersionContextProvider>
      </HeaderContextProvider>
    </ContentsProvider>
  </TabProvider>
);

RootProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  headingNodes: PropTypes.arrayOf(PropTypes.object),
  selectors: PropTypes.object,
};

export default RootProvider;
