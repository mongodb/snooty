import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { stringifyTab } from '../constants';

export default class Tabs extends Component {
  constructor(props) {
    super(props);
    const { nodeData, addTabset } = this.props;
    const tabsetName = nodeData.options ? nodeData.options.tabset : this.generateAnonymousTabsetName(nodeData);
    this.state = { tabsetName };

    addTabset(tabsetName, [...nodeData.children]);
  }

  /*
   * For anonymous tabsets, create a tabset name that alphabetizes the tab names, formats them in lowercase,
   * and joins them with a forward slash (/)
   */
  generateAnonymousTabsetName = nodeData => {
    return nodeData.children
      .flatMap(child => child.argument[0].value.toLowerCase())
      .sort((a, b) => {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
      })
      .join('/');
  };

  render() {
    const { tabsetName } = this.state;
    const { nodeData, activeTabs, setActiveTab } = this.props;
    const isHeaderTabset = tabsetName === 'drivers' || tabsetName === 'cloud';
    return (
      <React.Fragment>
        <ul className="tab-strip tab-strip--singleton" role="tablist">
          {isHeaderTabset ||
            nodeData.children.map((tab, index) => {
              const tabName = tab.argument[0].value.toLowerCase();
              return (
                <li
                  className="tab-strip__element"
                  data-tabid={tabName}
                  role="tab"
                  aria-selected={activeTabs[tabsetName] === tabName ? 'true' : 'false'}
                  key={index}
                  onClick={() => {
                    setActiveTab(tabName, tabsetName);
                  }}
                >
                  {stringifyTab(tabName)}
                </li>
              );
            })}
        </ul>
        {nodeData.children.map((tab, index) => {
          const tabName = tab.argument[0].value.toLowerCase();
          return (
            activeTabs[tabsetName] === tabName && (
              <React.Fragment key={index}>
                {tab.children.map((tabChild, tabChildIndex) => (
                  <ComponentFactory {...this.props} nodeData={tabChild} key={tabChildIndex} />
                ))}
              </React.Fragment>
            )
          );
        })}
      </React.Fragment>
    );
  }
}

Tabs.propTypes = {
  activeTabs: PropTypes.shape({
    [PropTypes.string]: PropTypes.string,
  }).isRequired,
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        argument: PropTypes.arrayOf(
          PropTypes.shape({
            value: PropTypes.string.isRequired,
          })
        ).isRequired,
        children: PropTypes.array,
      })
    ),
  }).isRequired,
  addTabset: PropTypes.func.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};
