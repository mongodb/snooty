import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SiteMetadata from './site-metadata';
import { Global, css } from '@emotion/core';
import { TabContext } from './tab-context';
import Widgets from './Widgets';
import { findAllKeyValuePairs } from '../utils/find-all-key-value-pairs';
import { getNestedValue } from '../utils/get-nested-value';
import { getPlaintext } from '../utils/get-plaintext';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';

export default class DefaultLayout extends Component {
  constructor(props) {
    super(props);

    this.preprocessPageNodes();

    this.state = {
      activeTabs: undefined,
      pillstrips: {},
    };
  }

  componentDidMount() {
    this.setState(prevState => ({ activeTabs: { ...getLocalValue('activeTabs'), ...prevState.activeTabs } }));
  }

  addPillstrip = (pillstripKey, pillstripVal) => {
    this.setState(prevState => ({
      pillstrips: {
        ...prevState.pillstrips,
        [pillstripKey]: pillstripVal,
      },
    }));
  };

  preprocessPageNodes = () => {
    const { pageContext } = this.props;
    const pageNodes = getNestedValue(['__refDocMapping', 'ast', 'children'], pageContext) || [];

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
   * - references: a list of the ids that refer to this footnote
   */
  getFootnotes = nodes => {
    const footnotes = findAllKeyValuePairs(nodes, 'type', 'footnote');
    return footnotes.reduce((map, footnote, index) => {
      // Track how many anonymous footnotes are on the page so that we can correctly associate footnotes and references
      let anonymousCount = 0;
      if (footnote.name) {
        // Find references associated with a named footnote
        // eslint-disable-next-line no-param-reassign
        map[footnote.name] = {
          label: index + 1,
          references: this.getNamedFootnoteReferences(nodes, footnote.name),
        };
      } else {
        // Find references associated with an anonymous footnote
        // eslint-disable-next-line no-param-reassign
        map[footnote.id] = {
          label: index + 1,
          references: [this.getAnonymousFootnoteReferences(nodes, anonymousCount)],
        };
        anonymousCount += 1;
      }
      return map;
    }, {});
  };

  // Find all footnote_reference nodes associated with a given footnote by their refname
  getNamedFootnoteReferences = (nodes, refname) => {
    const footnoteReferences = findAllKeyValuePairs(nodes, 'type', 'footnote_reference');
    return footnoteReferences.filter(node => node.refname === refname).map(node => node.id);
  };

  // They are used infrequently, but here we match an anonymous footnote to its reference.
  // The nth footnote on a page is associated with the nth reference on the page.
  getAnonymousFootnoteReferences = (nodes, index) => {
    const footnoteReferences = findAllKeyValuePairs(nodes, 'type', 'footnote_reference');
    return getNestedValue(
      [index, 'id'],
      footnoteReferences.filter(node => !Object.prototype.hasOwnProperty.call(node, 'refname'))
    );
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

  setActiveTab = (tabsetName, value) => {
    const { [tabsetName]: tabs } = this.state;
    let activeTab = value;
    if (tabs && !tabs.includes(value)) {
      activeTab = tabs[0];
    }
    this.setState(
      prevState => ({
        activeTabs: {
          ...prevState.activeTabs,
          [tabsetName]: activeTab,
        },
      }),
      () => {
        setLocalValue('activeTabs', this.state.activeTabs); // eslint-disable-line react/destructuring-assignment
      }
    );
  };

  render() {
    const {
      children,
      pageContext: { location, metadata, slug, __refDocMapping },
    } = this.props;

    const { pillstrips } = this.state;
    const lookup = slug === '/' ? 'index' : slug;
    const siteTitle = getNestedValue(['title'], metadata) || '';
    const pageTitle = getPlaintext(getNestedValue(['slugToTitle', lookup], metadata));
    return (
      <>
        // Adjust anchor link styling so titles aren't covered by navbar
        <Global
          styles={css`
            :root {
              --navbar-height: 55px;
            }
            h1:before,
            h2:before,
            h3:before,
            h4:before {
              content: '';
              display: block;
              height: var(--navbar-height);
              margin-top: calc(var(--navbar-height) * -1);
              position: relative;
              width: 0;
            }
          `}
        />
        <TabContext.Provider value={{ ...this.state, setActiveTab: this.setActiveTab }}>
          <Widgets
            location={location}
            pageOptions={getNestedValue(['ast', 'options'], __refDocMapping)}
            pageTitle={pageTitle}
            publishedBranches={getNestedValue(['publishedBranches'], metadata)}
            slug={slug}
          >
            <SiteMetadata siteTitle={siteTitle} pageTitle={pageTitle} />
            {React.cloneElement(children, {
              pillstrips,
              addPillstrip: this.addPillstrip,
              footnotes: this.footnotes,
            })}
          </Widgets>
        </TabContext.Provider>
      </>
    );
  }
}

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.shape({
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
