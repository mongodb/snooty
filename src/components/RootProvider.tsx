import React, { ReactNode } from 'react';
import { VersionContextProvider } from '../context/version-context';
import { TocContextProvider } from '../context/toc-context';
import { DarkModeContextProvider } from '../context/dark-mode-context';
import { PageContextRepoBranches, RemoteMetadata } from '../types/data';
import { HeadingNode } from '../types/ast';
import { HeaderContextProvider } from './Header/header-context';
import { SidenavContextProvider } from './Sidenav';
import { ContentsProvider } from './Contents/contents-context';

export type RootProviderProps = {
  children: ReactNode;
  headingNodes: HeadingNode[];
  slug: string;
  repoBranches: PageContextRepoBranches;
  remoteMetadata: RemoteMetadata;
};

const RootProvider = ({ children, headingNodes, slug, repoBranches, remoteMetadata }: RootProviderProps) => {
  return (
    <DarkModeContextProvider slug={slug}>
      <ContentsProvider headingNodes={headingNodes}>
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

export default RootProvider;
