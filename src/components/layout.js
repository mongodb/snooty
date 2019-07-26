import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SiteMetadata from './site-metadata';
import { TabContext } from './tab-context';
import { getNestedValue } from '../utils/get-nested-value';
import { setLocalValue } from '../utils/browser-storage';

export default class DefaultLayout extends Component {
  constructor(props) {
    super(props);

    const {
      pageContext: { __refDocMapping },
    } = props;
    const pageNodes = getNestedValue(['ast', 'children'], __refDocMapping) || [];

    this.normalizeCssClassNodes(pageNodes, 'name', 'cssclass');

    this.state = {
      activeTabs: {},
    };
  }

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
    this.setState(prevState => ({
      activeTabs: {
        ...prevState.activeTabs,
        [tabsetName]: activeTab,
      },
    }));
    setLocalValue(tabsetName, activeTab);
  };

  render() {
    const { children } = this.props;

    return (
      <TabContext.Provider value={{ ...this.state, setActiveTab: this.setActiveTab }}>
        <SiteMetadata />
        {children}
      </TabContext.Provider>
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
  }).isRequired,
};
