import React, { Component } from 'react';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
import { Global, css } from '@emotion/core';
import SiteMetadata from '../components/site-metadata';
import { TabProvider } from '../components/tab-context';
import { getNestedValue } from '../utils/get-nested-value';
import { getPlaintext } from '../utils/get-plaintext';
import { theme } from '../theme/docsTheme.js';
import { getTemplate } from '../utils/get-template';
import Navbar from '../components/Navbar';

const Widgets = loadable(() => import('../components/Widgets'));

export default class DefaultLayout extends Component {
  render() {
    const { children, location, pageContext } = this.props;
    const { metadata, page, slug, template } = pageContext;
    const lookup = slug === '/' ? 'index' : slug;
    const siteTitle = getNestedValue(['title'], metadata) || '';
    const pageTitle = getPlaintext(getNestedValue(['slugToTitle', lookup], metadata));
    const Template = getTemplate(template, slug);
    return (
      <>
        {/* Anchor-link styling to compensate for navbar height */}
        <Global
          styles={css`
            .contains-headerlink::before {
              content: '';
              display: block;
              height: calc(${theme.navbar.height} + 10px);
              margin-top: calc((${theme.navbar.height} + 10px) * -1);
              position: relative;
              width: 0;
            }
          `}
        />
        <TabProvider selectors={getNestedValue(['ast', 'options', 'selectors'], page)}>
          <Widgets
            location={location}
            pageOptions={getNestedValue(['ast', 'options'], page)}
            pageTitle={pageTitle}
            publishedBranches={getNestedValue(['publishedBranches'], metadata)}
            slug={slug}
          >
            <SiteMetadata siteTitle={siteTitle} pageTitle={pageTitle} />
            <Template pageContext={pageContext}>{children}</Template>
          </Widgets>
        </TabProvider>
        <Navbar />
      </>
    );
  }
}

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  pageContext: PropTypes.shape({
    page: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.arrayOf(PropTypes.object),
      }).isRequired,
    }).isRequired,
    metadata: PropTypes.shape({
      slugToTitle: PropTypes.object,
      title: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
