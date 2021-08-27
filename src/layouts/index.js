import React from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/core';
import { UnifiedFooter } from '@mdb/consistent-nav';
import SiteMetadata from '../components/site-metadata';
import { ContentsProvider } from '../components/contents-context';
import { TabProvider } from '../components/tab-context';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { theme } from '../theme/docsTheme.js';
import { getTemplate } from '../utils/get-template';
import Navbar from '../components/Navbar';
import { useDelightedSurvey } from '../hooks/useDelightedSurvey';

const bannerPadding = css`
  #gatsby-focus-wrapper {
    margin-top: 50px;
  }
  div.sphinxsidebar {
    margin-top: ${theme.navbar.bannerHeight.small};

    @media ${theme.screenSize.upToMedium} {
      margin-top: ${theme.navbar.bannerHeight.medium};
    }

    @media not all and (max-width: 1600px) {
      margin-top: ${theme.navbar.bannerHeight.large};
    }
  }
`;

// TODO: Delete this as a part of the css cleanup
// Currently used to preserve behavior and stop legacy css
// from overriding specified styles in imported footer
const footerOverrides = css`
  footer {
    a:hover {
      color: currentColor;
    }
  }
`;

const calculateNavSize = (bannerHeight) =>
  `(${theme.bannerContent.enabled ? bannerHeight : '0px'} + ${theme.navbar.baseHeight} + 10px)`;

const globalCSS = css`
  ${theme.bannerContent.enabled ? bannerPadding : ''}
  .contains-headerlink::before {
    content: '';
    display: block;
    height: calc(${calculateNavSize(theme.navbar.bannerHeight.small)});
    margin-top: calc(${calculateNavSize(theme.navbar.bannerHeight.small)} * -1);
    position: relative;
    width: 0;

    @media ${theme.screenSize.upToMedium} {
      height: calc(${calculateNavSize(theme.navbar.bannerHeight.medium)});
      margin-top: calc(${calculateNavSize(theme.navbar.bannerHeight.medium)} * -1);
    }

    @media not all and (max-width: 1600px) {
      height: calc(${calculateNavSize(theme.navbar.bannerHeight.large)});
      margin-top: calc(${calculateNavSize(theme.navbar.bannerHeight.large)} * -1);
    }
  }

  .hidden {
    display: inherit !important;
    height: 0;
    margin: 0;
    padding: 0;
    visibility: hidden !important;
    width: 0;
  }
  ${footerOverrides}
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
  useDelightedSurvey(slug);

  return (
    <>
      {/* Anchor-link styling to compensate for navbar height */}
      <Global styles={globalCSS} />
      <SiteMetadata siteTitle={title} />
      <TabProvider selectors={page?.options?.selectors}>
        <ContentsProvider headingNodes={page?.options?.headings}>
          <Template {...props}>{children}</Template>
        </ContentsProvider>
      </TabProvider>
      <Navbar />
      {process.env.GATSBY_FEATURE_FLAG_CONSISTENT_NAVIGATION && <UnifiedFooter hideLocale={true} />}
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
