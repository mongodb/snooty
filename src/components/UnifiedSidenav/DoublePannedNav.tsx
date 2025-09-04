import React from 'react';
import { BackLink } from '@leafygreen-ui/typography';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import { SideNav } from '@leafygreen-ui/side-nav';
import { theme } from '../../theme/docsTheme';
import useScreenSize from '../../hooks/useScreenSize';
import DocsHomeButton from '../Sidenav/DocsHomeButton';
import { DownloadButton } from '../OfflineDownloadModal';
import { NavTopContainer, downloadButtonStlying, ArtificialPadding } from './UnifiedSidenav';
import { StaticNavItem, UnifiedTocNavItem } from './UnifiedTocNavItems';
import { UnifiedVersionDropdown } from './UnifiedVersionDropdown';
import { TocItem } from './types';

export const leftPane = LeafyCSS`
  flex: 0 0 161px;
  overflow-y: auto;
  border-right: 1px solid var(--sidenav-border-bottom-color);
  width: 161px !important;
  padding-top: ${theme.size.default};
`;

export const rightPane = LeafyCSS`
  flex: 0 0 264px;
  overflow-y: auto;
  border-right: 1px solid var(--sidenav-border-bottom-color);
  padding-top: ${theme.size.default};

  // Height for the version dropdown
  button {
    margin-left: -8px;
    height: 28px;
  }
`;

const backLinkStyling = LeafyCSS`
  padding-left: ${theme.size.default};
  padding-top: ${theme.size.small};
  font-size: ${theme.fontSize.small};

  :hover {
    text-decoration: none;
  }
`;

const sideNavStyle = LeafyCSS`  
  height: 100%;
  padding: 0px;

  @media ${theme.screenSize.upTo2XLarge} {
    display: none;
  }
`;

const panelStyling = LeafyCSS`
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 50px;
    height: calc(100% - 120px);
    padding-top: 10px;
    border-bottom: 1px solid var(--sidenav-border-bottom-color);
    width: 100%;

    ul {
      display: block;
      width: 100%;
    }

`;

interface DoublePannedNavProps {
  showDriverBackBtn: boolean;
  setShowDriverBackBtn: (show: boolean) => void;
  tree: TocItem[];
  slug: string;
  currentL2s?: TocItem | null;
  setCurrentL1: (item: TocItem) => void;
  setCurrentL2s: (item: TocItem) => void;
  currentL1?: TocItem;
}

export const DoublePannedNav = ({
  showDriverBackBtn,
  setShowDriverBackBtn,
  tree,
  slug,
  currentL2s,
  setCurrentL1,
  setCurrentL2s,
  currentL1,
}: DoublePannedNavProps) => {
  const { isTabletOrMobile } = useScreenSize();

  return (
    <SideNav
      widthOverride={currentL2s?.items && currentL2s.items.length > 0 ? 426 : 161}
      className={cx(sideNavStyle)}
      aria-label="Side navigation Panel"
    >
      <div className={cx(NavTopContainer(isTabletOrMobile))}>
        <ArtificialPadding />
        <DocsHomeButton />
      </div>
      <div className={cx(panelStyling)} data-nav-panel="fixed-sidenav">
        <div className={cx(leftPane)} data-nav-pane="left">
          {tree.map((staticTocItem) => (
            <StaticNavItem
              {...staticTocItem}
              slug={slug}
              key={staticTocItem.url + staticTocItem.label}
              setCurrentL1={setCurrentL1}
              setCurrentL2s={setCurrentL2s}
              setShowDriverBackBtn={setShowDriverBackBtn}
              isAccordion={false}
            />
          ))}
        </div>
        {currentL1?.versionDropdown && <UnifiedVersionDropdown contentSite={currentL1?.contentSite} />}
        {currentL2s?.items && currentL2s.items.length > 0 && (
          <div className={cx(rightPane)} data-nav-pane="right">
            {showDriverBackBtn && (
              <BackLink
                className={cx(backLinkStyling)}
                onClick={() => setShowDriverBackBtn(false)}
                href={currentL1?.url}
              >
                Back to {currentL1?.label}
              </BackLink>
            )}
            {currentL2s.items?.map((navItems) => (
              <UnifiedTocNavItem
                {...navItems}
                level={1}
                key={navItems.url + navItems.label}
                slug={slug}
                isAccordion={false}
                setCurrentL1={setCurrentL1}
                setCurrentL2s={setCurrentL2s}
                setShowDriverBackBtn={setShowDriverBackBtn}
              />
            ))}
          </div>
        )}
      </div>
      <div className={cx(downloadButtonStlying)}>
        <DownloadButton />
      </div>
    </SideNav>
  );
};
