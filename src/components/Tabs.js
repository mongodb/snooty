import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { Tabs as LeafyTabs, Tab as LeafyTab } from '@leafygreen-ui/tabs';
import ComponentFactory from './ComponentFactory';
import { TabContext } from './tab-context';
import { theme } from '../theme/docsTheme';
import { reportAnalytics } from '../utils/report-analytics';
import { getNestedValue } from '../utils/get-nested-value';

const getTabId = node => getNestedValue(['options', 'tabid'], node);

// Name anonymous tabsets by alphabetizing their tabids and concatenating with a forward slash
const generateAnonymousTabsetName = tabIds => [...tabIds].sort().join('/');

const TabButton = ({ ...props }) => <button {...props} />;

const hiddenTabsStyling = css`
  & > div:first-child {
    display: none;
  }
`;

const landingTabsStyling = css`
  width: 100%;

  & > div:first-child > button {
    flex-grow: 1;
    min-width: 55px;
    padding: 12px ${theme.size.default};

    @media ${theme.screenSize.upToMedium} {
      padding: 12px ${theme.size.small};
    }
    @media ${theme.screenSize.upToSmall} {
      padding: 12px ${theme.size.tiny};
    }
  }
`;

const getTabsStyling = ({ isHidden, isProductLanding }) => css`
  ${isHidden && hiddenTabsStyling};
  ${isProductLanding && landingTabsStyling};
`;

const landingTabStyling = css`
  display: grid;
  column-gap: ${theme.size.medium};
  grid-template-columns: repeat(2, 1fr);
  margin-top: ${theme.size.xlarge};

  img {
    border-radius: ${theme.size.small};
    grid-column: 2;
    margin: auto;
    display: block;
  }

  @media ${theme.screenSize.upToMedium} {
    display: block;
  }

  @media ${theme.screenSize.upToSmall} {
    margin-top: 40px;
  }
`;

const getTabStyling = ({ isProductLanding }) => css`
  ${isProductLanding && landingTabStyling}
`;

const Tabs = ({ nodeData: { children, options = {} }, page, ...rest }) => {
  const { activeTabs, selectors, setActiveTab } = useContext(TabContext);
  const tabIds = children.map(child => getTabId(child));
  const tabsetName = options.tabset || generateAnonymousTabsetName(tabIds);
  const [activeTab, setActiveTabIndex] = useState(0);
  const previousTabsetChoice = activeTabs[tabsetName];
  // Hide tabset if it includes the :hidden: option, or if it is controlled by a dropdown selector
  const isHidden = options.hidden || Object.keys(selectors).includes(tabsetName);
  const isProductLanding = page?.options?.template === 'product-landing';

  useEffect(() => {
    if (!previousTabsetChoice || !tabIds.includes(previousTabsetChoice)) {
      // Set first tab as active if no tab was previously selected
      setActiveTab({ name: tabsetName, value: getTabId(children[0]) });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const index = tabIds.indexOf(activeTabs[tabsetName]);
    if (index !== -1) {
      setActiveTabIndex(index);
    }
  }, [activeTabs, tabIds, tabsetName]);

  const handleClick = useCallback(
    index => {
      const tabId = tabIds[index];
      setActiveTab({
        name: tabsetName,
        value: tabId,
      });
      reportAnalytics('Tab Selected', {
        tabId,
        tabSet: tabsetName,
      });
    },
    [setActiveTab, tabIds, tabsetName]
  );

  return (
    <LeafyTabs
      className={cx(getTabsStyling({ isHidden, isProductLanding }))}
      as={TabButton}
      selected={activeTab}
      setSelected={handleClick}
    >
      {children.map(tab => {
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
