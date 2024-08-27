import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { Tabs as LeafyTabs, Tab as LeafyTab } from '@leafygreen-ui/tabs';
import { palette } from '@leafygreen-ui/palette';
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
  margin-bottom: ${theme.size.medium};
  ${TAB_BUTTON_SELECTOR} {
    color: var(--tab-color-primary);
    font-size: ${theme.size.default};
    align-items: center;

    &[aria-selected='true'] {
      color: var(--tab-color-secondary);
    }
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

  [aria-label*='Tabs to describe usage of'] {
    /* Using a background allows the "border" to appear underneath the individual tab color */
    background: linear-gradient(0deg, ${palette.gray.light2} 1px, rgb(255 255 255 / 0%) 1px);

    .dark-theme & {
      /* Using a background allows the "border" to appear underneath the individual tab color */
      background: linear-gradient(0deg, ${palette.gray.dark2} 1px, rgb(255 255 255 / 0%) 1px);
    }
  }
`;

const tabContentStyling = css`
  margin-top: ${theme.size.medium};
`;

const productLandingTabContentStyling = css`
  display: grid;
  column-gap: ${theme.size.medium};
  grid-template-columns: repeat(2, 1fr);

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

const Tabs = ({ nodeData: { children, options = {} }, page, ...rest }) => {
  const { activeTabs, selectors, setActiveTab } = useContext(TabContext);
  const tabIds = children.map((child) => getTabId(child));
  const tabsetName = options.tabset || generateAnonymousTabsetName(tabIds);
  const [activeTab, setActiveTabIndex] = useState(() => {
    // activeTabIdx at build time should be -1 if tabsetName !== drivers
    // since no local storage to read, and no default tabs
    const activeTabIdx = tabIds.indexOf(activeTabs?.[tabsetName]);
    return activeTabIdx > -1 ? activeTabIdx : 0;
  });

  const scrollAnchorRef = useRef();
  // Hide tabset if it includes the :hidden: option, or if it is controlled by a dropdown selector
  const isHidden = options.hidden || Object.keys(selectors).includes(tabsetName);
  const isProductLanding = page?.options?.template === 'product-landing';

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

      setActiveTab({ [tabsetName]: tabId });
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
          forceRenderAllTabPanels={true}
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
              <LeafyTab key={tabId} name={tabTitle}>
                <div className={cx(tabContentStyling, isProductLanding ? productLandingTabContentStyling : '')}>
                  {tab.children.map((child, i) => (
                    <ComponentFactory {...rest} key={`${tabId}-${i}`} nodeData={child} />
                  ))}
                </div>
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
