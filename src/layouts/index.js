import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/core';
import SiteMetadata from '../components/site-metadata';
import { ContentsProvider } from '../components/contents-context';
import { TabProvider } from '../components/tab-context';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { getTemplate } from '../utils/get-template';
import Header from '../components/Header';
import styled from '@emotion/styled';
import style from '../styles/navigation.module.css';
// TODO: Delete file and remove import
import { SidebarContext } from '../components/sidebar-context';
import useScreenSize from '../hooks/useScreenSize.js';
import { isBrowser } from '../utils/is-browser.js';
import Sidebar from '../components/Sidebar';

const globalCSS = css`
  .hidden {
    display: inherit !important;
    height: 0;
    margin: 0;
    padding: 0;
    visibility: hidden !important;
    width: 0;
  }
`;

const GlobalGrid = styled('div')`
  display: grid;
  grid-template-areas:
    'header header'
    'sidebar contents';
  grid-template-columns: auto 1fr;
  grid-template-rows: 45px 1fr;
  height: 100vh;
`;

const DefaultLayout = props => {
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
  // TODO: Check if this styling is still necessary after current Sidebar is replaced with the LG Sidebar
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
            {/* Add Grid div here */}
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
