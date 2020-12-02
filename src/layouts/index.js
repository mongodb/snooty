import React from 'react';
import PropTypes from 'prop-types';
import { Global, css } from '@emotion/core';
import SiteMetadata from '../components/site-metadata';
import { ContentsProvider } from '../components/contents-context';
import { TabProvider } from '../components/tab-context';
import { getNestedValue } from '../utils/get-nested-value';
import { theme } from '../theme/docsTheme.js';
import { getTemplate } from '../utils/get-template';
import Navbar from '../components/Navbar';

const bannerPadding = css`
  #gatsby-focus-wrapper {
    margin-top: 50px;
  }
  div.sphinxsidebar {
    margin-top: 50px;
  }
`;

const globalCSS = css`
  ${theme.bannerContent ? bannerPadding : ''}
  .contains-headerlink::before {
    content: '';
    display: block;
    height: calc(${theme.navbar.height} + 10px);
    margin-top: calc((${theme.navbar.height} + 10px) * -1);
    position: relative;
    width: 0;
  }
`;

const PageNotFoundLayout = props => {
  const { children, pageContext } = props;
  const { slug } = pageContext;
  const template = 'landing';

  const Template = getTemplate(template, slug);

  return (
    <>
      <Global styles={globalCSS} />
      <Template {...props}>{[children]}</Template>
      <Navbar />
    </>
  );
};

const DefaultLayout = props => {
  const { children, pageContext } = props;

  if (pageContext.layout === '404') {
    return PageNotFoundLayout(props);
  }

  const {
    metadata: { title },
    page,
    slug,
    template,
  } = pageContext;
  const Template = getTemplate(template, slug);
  return (
    <>
      {/* Anchor-link styling to compensate for navbar height */}
      <Global styles={globalCSS} />
      <SiteMetadata siteTitle={title} />
      <TabProvider selectors={getNestedValue(['ast', 'options', 'selectors'], page)}>
        <ContentsProvider nodes={getNestedValue(['ast', 'children'], page)}>
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
      ast: PropTypes.shape({
        options: PropTypes.object,
      }).isRequired,
    }).isRequired,
    slug: PropTypes.string,
    template: PropTypes.string,
  }).isRequired,
};

export default DefaultLayout;
