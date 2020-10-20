import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { TabContext } from './tab-context';
import { reportAnalytics } from '../utils/report-analytics';
import { getNestedValue } from '../utils/get-nested-value';
import { getPlaintext } from '../utils/get-plaintext';

const getTabId = node => getNestedValue(['options', 'tabid'], node);

// Name anonymous tabsets by alphabetizing their tabids and concatenating with a forward slash
const generateAnonymousTabsetName = tabIds => [...tabIds].sort().join('/');

const Tabs = ({ nodeData: { children, options = {} }, ...rest }) => {
  const { activeTabs, selectors, setActiveTab } = useContext(TabContext);
  const tabIds = children.map(child => getTabId(child));
  const tabsetName = options.tabset || generateAnonymousTabsetName(tabIds);
  const activeTab = activeTabs[tabsetName];
  // Hide tabset if it includes the :hidden: option, or if it is controlled by a dropdown selector
  const isHidden =
    Object.prototype.hasOwnProperty.call(options, 'hidden') || Object.keys(selectors).includes(tabsetName);

  useEffect(() => {
    if (!activeTab || !tabIds.includes(activeTab)) {
      // Set first tab as active if no tab was previously selected
      setActiveTab({ name: tabsetName, value: getTabId(children[0]) });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (e, { tabId, tabTitle }) => {
    const element = e.target;
    // Get the initial position of the tab clicked
    // to avoid page jumping after new tab is selected
    const initRect = element.getBoundingClientRect();

    // Get the position where the user scrolled to
    const initScrollY = window.scrollY || document.documentElement.scrollTop;

    // Calc the distance from the tab strip to the top
    // of whatever the user has scrolled to
    const offset = initScrollY - initRect.top;

    setActiveTab({ name: tabsetName, value: tabId });

    // Get the position of tab strip after re-render
    const rects = element.getBoundingClientRect();

    // Reset the scroll position of the browser
    window.scrollTo(rects.x, rects.top + offset);
    reportAnalytics('Tab Selected', {
      tabId,
      title: tabTitle,
      tabSet: tabsetName,
    });
  };

  // Certain tabsets are rendered at the top of the page, rather than inline, in Guides
  return (
    <>
      {isHidden || (
        <ul className="tab-strip tab-strip--singleton" role="tablist">
          {children.map(tab => {
            const tabId = getTabId(tab);
            const tabTitle =
              tab.argument.length > 0
                ? tab.argument.map((arg, i) => <ComponentFactory {...rest} key={`${tabId}-arg-${i}`} nodeData={arg} />)
                : tabId;
            return (
              <li
                aria-selected={activeTab === tabId ? true : false}
                className="tab-strip__element"
                data-tabid={tabId}
                role="tab"
                key={tabId}
                onClick={e => {
                  handleClick(e, { tabId, tabTitle: getPlaintext(tab.argument) || tabId });
                }}
              >
                {tabTitle}
              </li>
            );
          })}
        </ul>
      )}
      {children.map(tab => {
        const tabId = getTabId(tab);
        return activeTab === tabId ? (
          <div role="tabpanel" key={tabId}>
            {tab.children.map((child, i) => (
              <ComponentFactory {...rest} key={`${tabId}-${i}`} nodeData={child} />
            ))}
          </div>
        ) : null;
      })}
    </>
  );
};

Tabs.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        argument: PropTypes.arrayOf(PropTypes.object).isRequired,
        children: PropTypes.arrayOf(PropTypes.object),
        name: PropTypes.oneOf(['tab']),
        options: PropTypes.shape({
          tabid: PropTypes.string.isRequired,
        }).isRequired,
      })
    ),
    options: PropTypes.shape({
      hidden: PropTypes.bool,
      tabset: PropTypes.string,
    }),
  }).isRequired,
};

export default Tabs;
