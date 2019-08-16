import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { TabContext } from './tab-context';
import { PLATFORMS, stringifyTab } from '../constants';
import { reportAnalytics } from '../utils/report-analytics';
import { getNestedValue } from '../utils/get-nested-value';

const GUIDES_PILLSETS = ['cloud', 'drivers'];

export default class Tabs extends Component {
  constructor(props) {
    super(props);
    const { nodeData } = this.props;
    const tabsetName = getNestedValue(['options', 'tabset'], nodeData) || this.generateAnonymousTabsetName(nodeData);
    this.state = { tabsetName };
  }

  componentDidMount() {
    const { addTabset, nodeData } = this.props;
    const { activeTabs, setActiveTab } = this.context;
    const { tabsetName } = this.state;

    // Specially handle guides pillsets
    if (GUIDES_PILLSETS.includes(tabsetName) && addTabset !== undefined) {
      addTabset(tabsetName, [...nodeData.children]);
    } else if (!Object.prototype.hasOwnProperty.call(activeTabs, tabsetName)) {
      // If a tab preference isn't saved to local storage, select the first tab by default
      setActiveTab(tabsetName, getNestedValue(['children', 0, 'options', 'tabid'], nodeData));
    }
  }

  componentDidUpdate(prevProps) {
    const { addPillstrip, nodeData, pillstrips } = this.props;
    const { tabsetName } = this.state;
    if (prevProps.pillstrips[tabsetName] !== pillstrips[tabsetName] && Object.keys(pillstrips).includes(tabsetName)) {
      addPillstrip(tabsetName, nodeData);
    }
  }

  /*
   * For anonymous tabsets, create a tabset name that alphabetizes the tabid fields and joins them with a forward slash (/)
   */
  generateAnonymousTabsetName = nodeData => {
    return nodeData.children
      .map(child => getNestedValue(['options', 'tabid'], child))
      .sort()
      .join('/');
  };

  sortTabset = (nodeData, referenceArray) => {
    return nodeData.children.sort((a, b) => {
      const aValue = getNestedValue(['options', 'tabid'], a);
      const bValue = getNestedValue(['options', 'tabid'], b);
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
    const isHeaderTabset =
      tabsetName === 'drivers' || tabsetName === 'cloud' || Object.keys(pillstrips).includes(tabsetName);
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
              const tabId = getNestedValue(['options', 'tabid'], tab);
              const tabTitle = getNestedValue(['argument', 0, 'value'], tab) || stringifyTab(tabId);
              let ariaSelect = 'false';
              if (activeTabs) ariaSelect = activeTabs[tabsetName] === tabId ? 'true' : 'false';
              return (
                <li
                  className="tab-strip__element"
                  data-tabid={tabId}
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
                    await setActiveTab(tabsetName, tabId);

                    // Get the position of tab strip after re-render
                    const rects = element.getBoundingClientRect();

                    // Reset the scroll position of the browser
                    window.scrollTo(rects.x, rects.top + offset);
                    reportAnalytics('Tab Selected', {
                      tabId,
                      title: tabTitle,
                      tabSet: tabsetName,
                    });
                  }}
                >
                  {tabTitle}
                </li>
              );
            })}
          </ul>
        )}
        {tabs.map((tab, index) => {
          const tabId = getNestedValue(['options', 'tabid'], tab);

          // If there are no activeTabs, js would typically be disabled
          const tabContent =
            !activeTabs || Object.getOwnPropertyNames(activeTabs).length === 0
              ? this.createFragment(tab, index)
              : activeTabs[tabsetName] === tabId && this.createFragment(tab, index);

          return tabContent;
        })}
      </React.Fragment>
    );
  }
}

Tabs.propTypes = {
  addPillstrip: PropTypes.func,
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        argument: PropTypes.arrayOf(
          PropTypes.shape({
            value: PropTypes.string,
          })
        ).isRequired,
        children: PropTypes.array,
        name: PropTypes.oneOf(['tab']),
        options: PropTypes.shape({
          tabid: PropTypes.string.isRequired,
        }).isRequired,
      })
    ),
    options: PropTypes.shape({
      hidden: PropTypes.bool,
    }),
  }).isRequired,
  addTabset: PropTypes.func,
  pillstrips: PropTypes.objectOf(PropTypes.object),
};

Tabs.defaultProps = {
  addPillstrip: () => {},
  addTabset: undefined,
  pillstrips: {},
};

Tabs.contextType = TabContext;
