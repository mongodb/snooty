import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VersionContextProvider } from '../context/version-context';
import { TocContextProvider } from '../context/toc-context';
import { DarkModeContextProvider } from '../context/dark-mode-context';
import { HeaderContextProvider } from './Header/header-context';
import { SidenavContextProvider } from './Sidenav';
import { ContentsProvider } from './Contents/contents-context';

const RootProvider = ({ children, headingNodes, slug, repoBranches, remoteMetadata }) => {
  const [activeSelectorId, setActiveSelectorId] = useState(null);
  return (
    <DarkModeContextProvider slug={slug}>
      <ContentsProvider
        headingNodes={headingNodes}
        activeSelectorId={activeSelectorId}
        setActiveSelectorId={setActiveSelectorId}
      >
        <HeaderContextProvider>
          <VersionContextProvider repoBranches={repoBranches} slug={slug}>
            <TocContextProvider remoteMetadata={remoteMetadata}>
              <SidenavContextProvider>{children}</SidenavContextProvider>
            </TocContextProvider>
          </VersionContextProvider>
        </HeaderContextProvider>
      </ContentsProvider>
    </DarkModeContextProvider>
  );
};

RootProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  headingNodes: PropTypes.arrayOf(PropTypes.object),
};

export default RootProvider;
