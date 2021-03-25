import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { Tabs as LeafyTabs, Tab as LeafyTab } from '@leafygreen-ui/tabs';
import { useTheme } from 'emotion-theming';
import ComponentFactory from './ComponentFactory';
import { TabContext } from './tab-context';
import { reportAnalytics } from '../utils/report-analytics';
import { getNestedValue } from '../utils/get-nested-value';

const getTabId = node => getNestedValue(['options', 'tabid'], node);

// Name anonymous tabsets by alphabetizing their tabids and concatenating with a forward slash
const generateAnonymousTabsetName = tabIds => [...tabIds].sort().join('/');

const TabButton = ({ ...props }) => <button {...props} />;

const getTabsStyling = (screenSize, size) => {
  const hiddenTabsStyling = `
    & > div:first-child {
      display: none;
    }
  `;

  const landingTabsStyling = `
    width: 100%;
    & > div:first-child > button {
      flex-grow: 1;
    }
    button {
      min-width: 55px;
      padding: 12px ${size.default};
    }
    @media ${screenSize.upToMedium} {
      button {
        padding: 12px ${size.small};
      }
    }
    @media ${screenSize.upToSmall} {
      button {
        padding: 12px ${size.tiny};
      }
    }
  `;

  const styleTabs = ({ isHidden, isProductLanding }) => css`
    ${isHidden && hiddenTabsStyling};
    ${isProductLanding && landingTabsStyling};
  `;

  return { styleTabs };
};

const getTabStyling = (screenSize, size) => {
  const landingTabStyling = `
    display: grid;
    margin-top: 40px !important;
    img {
      margin: auto;
    }
    @media ${screenSize.smallAndUp} {
      margin-top: ${size.xlarge} !important;
    }
    @media ${screenSize.mediumAndUp} {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;

      img {
        grid-column: 2;
      }
    }
  `;

  const styleTab = ({ isProductLanding }) => css`
    ${isProductLanding && landingTabStyling};
  `;

  return { styleTab };
};

const Tabs = props => {
  const {
    nodeData: { children, options = {} },
    page,
    ...rest
  } = props;

  const { screenSize, size } = useTheme();
  const { styleTabs } = getTabsStyling(screenSize, size);
  const { styleTab } = getTabStyling(screenSize, size);
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
      className={cx(styleTabs({ isHidden, isProductLanding }))}
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
          <LeafyTab className={cx(styleTab({ isProductLanding }))} key={tabId} name={tabTitle}>
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
