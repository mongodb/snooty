import React from 'react';
import { SideNav } from '@leafygreen-ui/side-nav';
import { BackLink } from '@leafygreen-ui/typography';
import { css as LeafyCSS, cx } from '@leafygreen-ui/emotion';
import { useViewportSize } from '@leafygreen-ui/hooks';
import { theme } from '../../theme/docsTheme';
import useScreenSize from '../../hooks/useScreenSize';
import DocsHomeButton from '../Sidenav/DocsHomeButton';
import { DownloadButton } from '../OfflineDownloadModal';
import { NavTopContainer, downloadButtonStlying, ArtificialPadding } from './UnifiedSidenav';
import { UnifiedTocNavItem } from './UnifiedTocNavItems';

export const leftPane = () => LeafyCSS`
  overflow-y: auto;
  border-right: 1px solid var(--sidenav-border-bottom-color);
  width: 100%;
  padding-top: ${theme.size.default};
`;

const panelStyling = LeafyCSS`
    position: fixed;
    top: 50px;
    height: calc(100% - 120px);
    padding-top: 10px;
    border-bottom: 1px solid var(--sidenav-border-bottom-color);
    width: 100%;

    button {
      height: 28px;
    }

    ul {
      display: block;
      width: 100%;

      li {
        a {
          justify-content: space-between !important;
        }
      }
    }

`;

const sideNavStyle = ({ hideMobile }) => LeafyCSS`  
  height: 100%;
  padding: 0px;

  @media ${theme.screenSize['2XLargeAndUp']} {
    display: none;
  }

  // Mobile & Tablet nav
  @media ${theme.screenSize.upToLarge} {
    position: absolute;
    ${hideMobile && 'display: none;'}

    button[data-testid="side-nav-collapse-toggle"] {
      display: none;
    }
  }
`;

const backLinkStyling = LeafyCSS`
  padding-left: ${theme.size.medium};
  padding-top: ${theme.size.default};
  font-size: ${theme.fontSize.small};

  :hover {
    text-decoration: none;
  }
`;

export const AccordionNavPanel = ({
  showDriverBackBtn,
  setShowDriverBackBtn,
  displayedItems,
  slug,
  currentL2s,
  setCurrentL1,
  setCurrentL2s,
  hideMobile,
}) => {
  const { isTabletOrMobile } = useScreenSize();
  const viewportSize = useViewportSize();
  return (
    <SideNav
      widthOverride={isTabletOrMobile ? viewportSize.width : 290}
      className={cx(sideNavStyle({ hideMobile }))}
      aria-label="Side navigation Panel"
    >
      <div className={cx(NavTopContainer(isTabletOrMobile))}>
        <ArtificialPadding />
        <DocsHomeButton />
      </div>
      <div className={cx(panelStyling)}>
        <div className={cx(leftPane)}>
          {showDriverBackBtn && (
            <BackLink
              className={cx(backLinkStyling)}
              onClick={() => setShowDriverBackBtn(false)}
              href="/master/java/bianca.laube/DOP-5372/builders/index.html"
            >
              Back to Client Libraries
            </BackLink>
          )}
          {displayedItems.map((navItems) => (
            <UnifiedTocNavItem
              {...navItems}
              level={1}
              key={navItems.newUrl + navItems.label}
              group={true}
              isStatic={!showDriverBackBtn}
              slug={slug}
              currentL2s={currentL2s}
              isAccordion={true}
              setCurrentL1={setCurrentL1}
              setCurrentL2s={setCurrentL2s}
              setShowDriverBackBtn={setShowDriverBackBtn}
            />
          ))}
        </div>
      </div>
      <div className={cx(downloadButtonStlying)}>
        <DownloadButton />
      </div>
    </SideNav>
  );
};
