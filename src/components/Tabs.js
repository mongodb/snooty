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
    const { addPillstripData, nodeData } = this.props;
    const tabsetName = getNestedValue(['options', 'tabset'], nodeData) || this.generateAnonymousTabsetName(nodeData);
    this.state = { tabsetName };
  }

  componentDidMount() {
    const { addTabset, nodeData } = this.props;
    const { setActiveTab } = this.context;
    const { tabsetName } = this.state;
    if (addTabset !== undefined) {
      console.log('here');
      console.log(this.props);
      addTabset(tabsetName, [...nodeData.children]);
    } else {
      setActiveTab(tabsetName, getNestedValue(['children', 0, 'argument', 0, 'value'], nodeData));
    }
  }

  /*
   * For anonymous tabsets, create a tabset name that alphabetizes the tab names, formats them in lowercase,
   * and joins them with a forward slash (/)
   */
  generateAnonymousTabsetName = nodeData => {
    return nodeData.children
      .map(child => {
        const tabName = getNestedValue(['argument', 0, 'value'], child);
        if (!tabName) return null;
        return child.argument[0].value.toLowerCase();
      })
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

  createFragment = (tab, index) => {
    return (
      <React.Fragment key={index}>
        {tab.children.map((tabChild, tabChildIndex) => (
          <ComponentFactory {...this.props} nodeData={tabChild} key={tabChildIndex} />
        ))}
      </React.Fragment>
    );
  };

  render() {
    const { tabsetName } = this.state;
    const { nodeData, pillstrips } = this.props;
    const { activeTabs, setActiveTab } = this.context;
    const isHeaderTabset = tabsetName === 'drivers' || tabsetName === 'cloud' || pillstrips.includes(tabsetName);
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
              let ariaSelect = 'false';
              if (activeTabs) ariaSelect = activeTabs[tabsetName] === tabName ? 'true' : 'false';
              return (
                <li
                  className="tab-strip__element"
                  data-tabid={tabName}
                  role="tab"
                  aria-selected={ariaSelect}
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
                    await setActiveTab(tabsetName, tabName);

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

          // If there are no activeTabs, js would typically be disabled
          const tabContent =
            !activeTabs || Object.getOwnPropertyNames(activeTabs).length === 0
              ? this.createFragment(tab, index)
              : activeTabs[tabsetName] === tabName && this.createFragment(tab, index);

          return tabContent;
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
