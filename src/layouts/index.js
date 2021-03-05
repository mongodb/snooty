import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import { ContentsProvider } from '../components/contents-context';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SidebarContext from '../components/sidebar-context';
import SiteMetadata from '../components/site-metadata';
import { TabProvider } from '../components/tab-context';
import useScreenSize from '../hooks/useScreenSize.js';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import style from '../styles/navigation.module.css';
import { getTemplate } from '../utils/get-template';
import { isBrowser } from '../utils/is-browser.js';

const globalCSS = css`
  body {
    font-size: 16px;
    line-height: 24px;
  }

  .hidden {
    display: inherit !important;
    height: 0;
    margin: 0;
    padding: 0;
    visibility: hidden !important;
    width: 0;
  }

  // Originally from docs-tools navbar.css
  img.hide-medium-and-up,
  img.show-medium-and-up {
    max-width: 100%;
  }
  .hide-medium-and-up {
    display: none !important;
  }
  .show-medium-and-up {
    display: block !important;
  }
  @media (max-width: 767px) {
    .hide-medium-and-up {
      display: block !important;
    }
    .show-medium-and-up {
      display: none !important;
    }
  }
`;

const GlobalGrid = styled('div')`
  display: grid;
  grid-template-areas:
    'header header'
    'sidebar contents';
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

const DefaultLayout = (props) => {
  const { children, pageContext } = props;
  const { project } = useSiteMetadata();
  const {
    metadata: { publishedBranches, title, toctree },
    page,
    slug,
    template,
  } = pageContext;
  const Template = getTemplate(project, slug, template);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isTabletOrMobile } = useScreenSize();
  const [showLeftColumn, setShowLeftColumn] = useState(!isTabletOrMobile);
  // TODO: (DOP-1839) Check if this styling is still necessary after current Sidebar is replaced with the LG Sidebar
  /* Add the postRender CSS class without disturbing pre-render functionality */
  const renderStatus = isBrowser ? style.postRender : '';

  const toggleLeftColumn = () => {
    setShowLeftColumn(!showLeftColumn);
  };

  useEffect(() => {
    setShowLeftColumn(!isTabletOrMobile);
  }, [isTabletOrMobile]);

  return (
    <>
      <Global styles={globalCSS} />
      <SiteMetadata siteTitle={title} />
      <TabProvider selectors={page?.options?.selectors}>
        <ContentsProvider nodes={page?.children}>
          <SidebarContext.Provider
            value={{
              isMobileMenuOpen,
              setIsMobileMenuOpen,
            }}
          >
            <GlobalGrid>
              <Header />
              {!isBrowser || showLeftColumn || isMobileMenuOpen ? (
                <div
                  className={`left-column ${style.leftColumn} ${renderStatus}`}
                  css={css`
                    grid-area: sidebar;
                    width: 330px;
                  `}
                  id="left-column"
                >
                  <Sidebar
                    slug={slug}
                    publishedBranches={publishedBranches}
                    toctreeData={toctree}
                    toggleLeftColumn={toggleLeftColumn}
                  />
                </div>
              ) : (
                <span
                  className={`showNav ${style.showNav} ${renderStatus}`}
                  css={css`
                    grid-area: sidebar;
                  `}
                  id="showNav"
                  onClick={toggleLeftColumn}
                >
                  Navigation
                </span>
              )}
              <Template
                css={css`
                  grid-area: contents;
                  margin: 0px;
                  overflow-y: auto;
                `}
                {...props}
              >
                {template === 'landing' ? [children] : children}
              </Template>
            </GlobalGrid>
          </SidebarContext.Provider>
        </ContentsProvider>
      </TabProvider>
    </>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  pageContext: PropTypes.shape({
    page: PropTypes.shape({
      options: PropTypes.object,
    }).isRequired,
    slug: PropTypes.string,
    template: PropTypes.string,
  }).isRequired,
};

export default DefaultLayout;
