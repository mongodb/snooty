import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { Tabs as LeafyTabs, Tab as LeafyTab } from '@leafygreen-ui/tabs';
import { CodeProvider } from '../Code/code-context';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';
import { reportAnalytics } from '../../utils/report-analytics';
import { getNestedValue } from '../../utils/get-nested-value';
import { isBrowser } from '../../utils/is-browser';
import { TabContext } from './tab-context';

const TAB_BUTTON_SELECTOR = 'button[role="tab"]';

const getTabId = (node) => getNestedValue(['options', 'tabid'], node);

// Name anonymous tabsets by alphabetizing their tabids and concatenating with a forward slash
const generateAnonymousTabsetName = (tabIds) => [...tabIds].sort().join('/');

const getPosition = (element) => {
  if (!isBrowser || !element) return { x: 0, y: 0 };
  const { x, y } = element.getBoundingClientRect();
  return { x, y };
};

const defaultTabsStyling = css`
  ${TAB_BUTTON_SELECTOR} {
    font-size: ${theme.size.default};
    align-items: center;
  }

  @media ${theme.screenSize.upTo2XLarge} {
    ${TAB_BUTTON_SELECTOR} {
      overflow: initial;
      max-width: initial;
      text-overflow: initial;
    }
  }
`;

const hiddenTabsStyling = css`
  & > div:first-of-type {
    display: none;
  }
`;

const landingTabsStyling = css`
  & > div:first-of-type {
    margin-top: ${theme.size.medium};
    margin-bottom: ${theme.size.large};

    ${TAB_BUTTON_SELECTOR} {
      display: block;
      flex-grow: 1;
    }
  }
`;

const getTabsStyling = ({ isHidden, isProductLanding }) => css`
  ${defaultTabsStyling};
  ${isHidden && hiddenTabsStyling};
  ${isProductLanding && landingTabsStyling};
`;

const landingTabStyling = css`
  display: grid;
  column-gap: ${theme.size.medium};
  grid-template-columns: repeat(2, 1fr);
  margin-top: unset !important;

  img {
    border-radius: ${theme.size.small};
    grid-column: 2;
    margin-top: 0px;
    display: block;
  }

  @media ${theme.screenSize.upToLarge} {
    display: block;
  }
`;

const getTabStyling = ({ isProductLanding }) => css`
  ${isProductLanding && landingTabStyling}
  margin-top: 24px;
`;

const Tabs = ({ nodeData: { children, options = {} }, page, ...rest }) => {
  const { activeTabs, selectors, setActiveTab } = useContext(TabContext);
  const tabIds = children.map((child) => getTabId(child));
  const tabsetName = options.tabset || generateAnonymousTabsetName(tabIds);
  const [activeTab, setActiveTabIndex] = useState(() => {
    // activeTabIdx at build time should be -1 if tabsetName !== drivers
    // since no local storage to read, and no default tabs
    const activeTabIdx = tabIds.indexOf(activeTabs?.[tabsetName]);
    console.log(
      `check active tab idx at build time for tabsetname ${tabsetName}: ${activeTabIdx} (should be -1 if tabsetName is not drivers, since no local storage to read, and no default values)`
    );

    return activeTabIdx > -1 ? activeTabIdx : 0;
  });

  const scrollAnchorRef = useRef();
  // Hide tabset if it includes the :hidden: option, or if it is controlled by a dropdown selector
  const isHidden = options.hidden || Object.keys(selectors).includes(tabsetName);
  const isProductLanding = page?.options?.template === 'product-landing';

  useEffect(() => {
    // correct tab choice on init
    // done in an effect (vs state init), as we need to update TabContext
    const savedTab = activeTabs[tabsetName];
    if (savedTab && tabIds.includes(savedTab)) {
      return;
    }

    let defaultTabIdx = activeTab;
    if (tabsetName === 'drivers') {
      const nodeOptionIdx = children.findIndex((item) => item.options.tabid === 'nodejs');
      defaultTabIdx = nodeOptionIdx > -1 ? nodeOptionIdx : defaultTabIdx;
    }

    console.log('updating active tab in context and in local storage on load');
    setActiveTab({ name: tabsetName, value: getTabId(children[defaultTabIdx]) });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const index = tabIds.indexOf(activeTabs[tabsetName]);
    if (index !== -1) {
      setActiveTabIndex(index);
    }
  }, [activeTabs, tabIds, tabsetName]);

  const handleClick = useCallback(
    (index) => {
      const tabId = tabIds[index];
      const priorAnchorOffset = getPosition(scrollAnchorRef.current).y;

      setActiveTab({
        name: tabsetName,
        value: tabId,
      });
      reportAnalytics('Tab Selected', {
        tabId,
        tabSet: tabsetName,
      });

      // Delay preserving scroll behavior by 40ms to allow other tabset content bodies to render
      window.setTimeout(() => {
        window.scrollTo(0, getPosition(scrollAnchorRef.current).y + window.scrollY - priorAnchorOffset);
      }, 40);
    },
    [setActiveTab, tabIds, tabsetName] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <>
      <div ref={scrollAnchorRef} aria-hidden="true"></div>
      <CodeProvider>
        <LeafyTabs
          className={cx(getTabsStyling({ isHidden, isProductLanding }))}
          aria-label={`Tabs to describe usage of ${tabsetName}`}
          selected={activeTab}
          setSelected={handleClick}
        >
          {children.map((tab) => {
            if (tab.name !== 'tab') {
              return null;
            }

            const tabId = getTabId(tab);
            const tabTitle =
              tab.argument.length > 0
                ? tab.argument.map((arg, i) => <ComponentFactory {...rest} key={`${tabId}-arg-${i}`} nodeData={arg} />)
                : tabId;

            return (
              <LeafyTab className={cx(getTabStyling({ isProductLanding }))} key={tabId} name={tabTitle}>
                {tab.children.map((child, i) => (
                  <ComponentFactory {...rest} key={`${tabId}-${i}`} nodeData={child} />
                ))}
              </LeafyTab>
            );
          })}
        </LeafyTabs>
      </CodeProvider>
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
