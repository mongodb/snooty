import React from "react";
import { VersionContextProvider } from "../context/version-context";
import { TocContextProvider } from "../context/toc-context";
import { DarkModeContextProvider } from "../context/dark-mode-context";
import { HeaderContextProvider } from "./Header/header-context";
import { SidenavContextProvider } from "./Sidenav";
import { ContentsProvider } from "./Contents/contents-context";

export type RootProviderProps = React.PropsWithChildren<{
  headingNodes: Record<string, unknown>[];
  slug: string;
  repoBranches: Record<string, unknown>;
  remoteMetadata: Record<string, unknown>;
}>;

const RootProvider = ({
  children,
  headingNodes,
  slug,
  repoBranches,
  remoteMetadata,
}: RootProviderProps) => {
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
