import React, { Component } from 'react';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
import { Global, css } from '@emotion/core';
import SiteMetadata from '../components/site-metadata';
import { TabProvider } from '../components/tab-context';
import { findAllKeyValuePairs } from '../utils/find-all-key-value-pairs';
import { getNestedValue } from '../utils/get-nested-value';
import { getPlaintext } from '../utils/get-plaintext';
import { theme } from '../theme/docsTheme.js';
import { getTemplate } from '../utils/get-template';
import FootnoteContext from '../components/footnote-context';
import Navbar from '../components/Navbar';

const Widgets = loadable(() => import('../components/Widgets'));

export default class DefaultLayout extends Component {
  constructor(props) {
    super(props);

    this.preprocessPageNodes();
  }

  preprocessPageNodes = () => {
    const { pageContext } = this.props;
    const pageNodes = getNestedValue(['page', 'ast', 'children'], pageContext) || [];

    // Map all footnotes and their references that appear on the page
    this.footnotes = this.getFootnotes(pageNodes);

    // Standardize cssclass nodes that appear on the page
    this.normalizeCssClassNodes(pageNodes, 'name', 'cssclass');
  };

  /*
   * Identify the footnotes on a page and all footnote_reference nodes that refer to them
   *
   * Returns a map wherein each key is the footnote name, and each value is an object containing:
   * - labels: the numerical label for the footnote
   * - references: a list of the footnote reference ids that refer to this footnote
   */
  getFootnotes = nodes => {
    const footnotes = findAllKeyValuePairs(nodes, 'type', 'footnote');
    const footnoteReferences = findAllKeyValuePairs(nodes, 'type', 'footnote_reference');
    // We label our footnotes by their index, regardless of their names to
    // circumvent cases such as [[1], [#], [2], ...]
    return footnotes.reduce((map, footnote, index) => {
      if (footnote.name) {
        // Find references associated with a named footnote
        // eslint-disable-next-line no-param-reassign
        map[footnote.name] = {
          label: index + 1,
          references: this.getNamedFootnoteReferences(footnoteReferences, footnote.name),
        };
      } else {
        // Find references associated with an anonymous footnote
        // Replace potentially broken anonymous footnote ids
        footnote.id = `${index + 1}`;
        // eslint-disable-next-line no-param-reassign
        map[footnote.id] = {
          label: index + 1,
          references: [this.getAnonymousFootnoteReferences(index)],
        };
      }
      return map;
    }, {});
  };

  // Find all footnote_reference node IDs associated with a given footnote by
  // that footnote's refname
  getNamedFootnoteReferences = (footnoteReferences, refname) => {
    return footnoteReferences.filter(node => node.refname === refname).map(node => node.id);
  };

  // They are used infrequently, but here we match an anonymous footnote to its reference.
  // The nth footnote on a page is associated with the nth reference on the page. Since
  // anon footnotes and footnote references are anonymous, we assume a 1:1 pairing, and
  // have no need to query nodes
  getAnonymousFootnoteReferences = index => {
    return `id${index + 1}`;
  };

  // Modify the AST so that the node modified by cssclass is included in its "children" array.
  // Delete this modified node from its original location.
  normalizeCssClassNodes = (nodes, key, value) => {
    const searchNode = (node, i, arr) => {
      // If a cssclass node has no children, add the proceeding node to its array of children,
      // thereby appending the specified class to that component.
      if (node[key] === value && i < arr.length - 1 && node.children.length === 0) {
        const nextNode = arr[i + 1];
        node.children.push(nextNode);
        arr.splice(i + 1, 1);
      }
      if (node.children) {
        node.children.forEach(searchNode);
      }
    };
    nodes.forEach(searchNode);
  };

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
            <Template pageContext={pageContext}>
              <FootnoteContext.Provider value={{ footnotes: this.footnotes }}>{children}</FootnoteContext.Provider>
            </Template>
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
