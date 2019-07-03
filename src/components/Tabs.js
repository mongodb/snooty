import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { TabContext } from './tab-context';
import { PLATFORMS, stringifyTab } from '../constants';
import { reportAnalytics } from '../utils/report-analytics';
import { getNestedValue } from '../utils/get-nested-value';

export default class Tabs extends Component {
  constructor(props) {
    super(props);
    const { nodeData } = this.props;
    const tabsetName = getNestedValue(['options', 'tabset'], nodeData) || this.generateAnonymousTabsetName(nodeData);
    this.state = { tabsetName };
  }

  componentDidMount() {
    const { addTabset: propsAddTabset, nodeData } = this.props;
    const { addTabset: contextAddTabset } = this.context;
    const { tabsetName } = this.state;
    const addTabset = propsAddTabset !== undefined ? propsAddTabset : contextAddTabset;
    addTabset(tabsetName, [...nodeData.children]);
  }

  /*
   * For anonymous tabsets, create a tabset name that alphabetizes the tab names, formats them in lowercase,
   * and joins them with a forward slash (/)
   */
  generateAnonymousTabsetName = nodeData => {
    return nodeData.children
      .map(child => child.argument[0].value.toLowerCase())
      .sort((a, b) => {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
      })
      .join('/');
  };

  sortTabset = (nodeData, referenceArray) => {
    return nodeData.children.sort((a, b) => {
      let aValue = getNestedValue(['argument', 0, 'value'], a);
      let bValue = getNestedValue(['argument', 0, 'value'], b);
      if (aValue) aValue = aValue.toLowerCase();
      if (bValue) bValue = bValue.toLowerCase();
      return referenceArray.indexOf(aValue) - referenceArray.indexOf(bValue);
    });
  };

  render() {
    const { tabsetName } = this.state;
    const { nodeData } = this.props;
    const { activeTabs, setActiveTab } = this.context;
    const isHeaderTabset = tabsetName === 'drivers' || tabsetName === 'cloud';
    const isHidden = nodeData.options && nodeData.options.hidden;
    const tabs =
      tabsetName === 'platforms' || PLATFORMS.some(p => tabsetName.includes(p))
        ? this.sortTabset(nodeData, PLATFORMS)
        : nodeData.children;

    return (
      <React.Fragment>
        {isHeaderTabset || isHidden || (
          <ul className="tab-strip tab-strip--singleton" role="tablist">
            {tabs.map((tab, index) => {
              let tabName = getNestedValue(['argument', 0, 'value'], tab);
              if (tabName) tabName = tabName.toLowerCase();
              return (
                <li
                  className="tab-strip__element"
                  data-tabid={tabName}
                  role="tab"
                  aria-selected={activeTabs[tabsetName] === tabName ? 'true' : 'false'}
                  key={index}
                  onClick={async e => {
                    const element = e.target;
                    // Get the initial position of the tab clicked
                    // to avoid page jumping after new tab is selected
                    const initRect = element.getBoundingClientRect();

                    // Get the position where the user scrolled to
                    const initScrollY = window.scrollY || document.documentElement.scrollTop;

                    // Calc the distance from the tab strip to the top
                    // of whatever the user has scrolled to
                    const offset = initScrollY - initRect.top;

                    // Await for page to re-render after setting active tab
                    await setActiveTab(tabName, tabsetName);

                    // Get the position of tab strip after re-render
                    const rects = element.getBoundingClientRect();

                    // Reset the scroll position of the browser
                    window.scrollTo(rects.x, rects.top + offset);
                    reportAnalytics('Tab Selected', {
                      tabId: tabName,
                      title: stringifyTab(tabName),
                      tabSet: tabsetName,
                    });
                  }}
                >
                  {stringifyTab(tabName)}
                </li>
              );
            })}
          </ul>
        )}
        {tabs.map((tab, index) => {
          let tabName = getNestedValue(['argument', 0, 'value'], tab);
          if (tabName) tabName = tabName.toLowerCase();
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
    options: PropTypes.shape({
      hidden: PropTypes.bool,
    }),
  }).isRequired,
  addTabset: PropTypes.func,
};

Tabs.defaultProps = {
  addTabset: undefined,
};

Tabs.contextType = TabContext;
