import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import { ContentsProvider } from '../components/contents-context';
import Header from '../components/Header';
import SiteMetadata from '../components/site-metadata';
import { SidebarContextProvider } from '../components/sidebar-context';
import Sidenav from '../components/Sidenav';
import { TabProvider } from '../components/tab-context';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { getTemplate } from '../utils/get-template';

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
    metadata: { title },
    page,
    slug,
    template,
  } = pageContext;
  const Template = getTemplate(project, slug, template);
  const isSidebarEnabled = template !== 'blank';

  return (
    <>
      <Global styles={globalCSS} />
      <SiteMetadata siteTitle={title} />
      <TabProvider selectors={page?.options?.selectors}>
        <ContentsProvider nodes={page?.children}>
          <GlobalGrid>
            <SidebarContextProvider isSidebarEnabled={isSidebarEnabled}>
              <Header />
              {isSidebarEnabled && <Sidenav pageContext={pageContext} />}
            </SidebarContextProvider>
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
