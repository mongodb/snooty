import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SiteMetadata from './site-metadata';
import { TabContext } from './tab-context';
import { findAllKeyValuePairs } from '../utils/find-all-key-value-pairs';
import { getNestedValue } from '../utils/get-nested-value';
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
    const {
      pageContext: { __refDocMapping },
    } = this.props;
    const pageNodes = getNestedValue(['ast', 'children'], __refDocMapping) || [];

    // Map all substitutions that appear on the page
    this.substitutions = this.getSubstitutions(pageNodes);

    // Standardize cssclass nodes that appear on the page
    this.normalizeCssClassNodes(pageNodes, 'name', 'cssclass');
  };

  // Identify and save all substitutions as defined in the specified nodes
  getSubstitutions = nodes => {
    // Find substitutions on page
    const substitutions = findAllKeyValuePairs(nodes, 'type', 'substitution_definition');

    // Create a map wherein each key is the word to be replaced, and each value is the nodes to replace it with.
    return substitutions.reduce((map, sub) => {
      map[sub.name] = sub.children; // eslint-disable-line no-param-reassign
      return map;
    }, {});
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
    const { children } = this.props;
    const { pillstrips } = this.state;

    return (
      <TabContext.Provider value={{ ...this.state, setActiveTab: this.setActiveTab }}>
        <SiteMetadata />
        {React.cloneElement(children, {
          pillstrips,
          addPillstrip: this.addPillstrip,
          substitutions: this.substitutions,
        })}
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
