import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/core';
import SiteMetadata from '../components/site-metadata';
import { ContentsProvider } from '../components/contents-context';
import { TabProvider } from '../components/tab-context';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { theme } from '../theme/docsTheme.js';
import { getTemplate } from '../utils/get-template';
import Navbar from '../components/Navbar';
import { ENABLED_SITES_FOR_DELIGHTED } from '../constants';

const bannerPadding = css`
  #gatsby-focus-wrapper {
    margin-top: 50px;
  }
  div.sphinxsidebar {
    margin-top: 50px;
  }
`;

const globalCSS = css`
  ${theme.bannerContent.enabled ? bannerPadding : ''}
  .contains-headerlink::before {
    content: '';
    display: block;
    height: calc(${theme.navbar.height} + 10px);
    margin-top: calc((${theme.navbar.height} + 10px) * -1);
    position: relative;
    width: 0;
  }

  .hidden {
    display: inherit !important;
    height: 0;
    margin: 0;
    padding: 0;
    visibility: hidden !important;
    width: 0;
  }
`;

const DefaultLayout = (props) => {
  const { children, pageContext } = props;
  const { parserBranch, project, snootyEnv } = useSiteMetadata();
  const {
    metadata: { title },
    page,
    slug,
    template,
  } = pageContext;
  const Template = getTemplate(project, slug, template);

  useEffect(() => {
    if (snootyEnv === 'production' && ENABLED_SITES_FOR_DELIGHTED.has(project)) {
      let projectName = project;
      if (project === 'docs') {
        projectName = 'manual';
      } else if (project === 'cloud-docs') {
        projectName = 'atlas';
      }

      window.delighted.survey({
        minTimeOnPage: 90,
        properties: {
          branch: parserBranch,
          project: projectName,
        },
      });
    }
  }, [parserBranch, project, slug, snootyEnv]);

  return (
    <>
      {/* Anchor-link styling to compensate for navbar height */}
      <Global styles={globalCSS} />
      <SiteMetadata siteTitle={title} />
      <TabProvider selectors={page?.options?.selectors}>
        <ContentsProvider nodes={page?.children}>
          <Template {...props}>{template === 'landing' ? [children] : children}</Template>
        </ContentsProvider>
      </TabProvider>
      <Navbar />
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
