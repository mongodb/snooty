import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { css as LeafyCss, cx } from '@leafygreen-ui/emotion';
import { Tabs as LeafyTabs, Tab as LeafyTab } from '@leafygreen-ui/tabs';
import ComponentFactory from './ComponentFactory';
import { TabContext } from './tab-context';
import { reportAnalytics } from '../utils/report-analytics';
import { getNestedValue } from '../utils/get-nested-value';
import { useTheme } from 'emotion-theming';

const getTabId = node => getNestedValue(['options', 'tabid'], node);

// Name anonymous tabsets by alphabetizing their tabids and concatenating with a forward slash
const generateAnonymousTabsetName = tabIds => [...tabIds].sort().join('/');

const TabButton = ({ ...props }) => <button {...props} />;

const useTabStyling = (screenSize, size) => {
  // Tabs styling
  const hiddenTabsStyling = css`
    & > div:first-child {
      display: none;
    }
  `;

  const landingTabsStyling = css`
    width: 100%;
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

  const StyledTabs = styled(LeafyTabs)`
    ${({ isHidden }) => isHidden && hiddenTabsStyling};
    ${({ isLanding }) => isLanding && landingTabsStyling};
  `;

  // Individual Tab styling:

  const landingTabStyling = css`
    display: grid;
    img {
      margin: auto;
    }
    @media ${screenSize.mediumAndUp} {
      grid-template-columns: repeat(2, 1fr);
      gap: 5px;
      padding: 20px;

      .left-column {
        grid-column: 1;
        min-width: 230px;
      }

      img {
        grid-column: 2;
      }
    }
  `;

  const styleTab = isLanding => LeafyCss`
    ${isLanding && landingTabStyling};
  `;

  return { StyledTabs, styleTab };
};

const Tabs = props => {
  const {
    nodeData: { children, options = {} },
    page,
    ...rest
  } = props;

  const { screenSize, size } = useTheme();
  const { StyledTabs, styleTab } = useTabStyling(screenSize, size);
  const { activeTabs, selectors, setActiveTab } = useContext(TabContext);
  const tabIds = children.map(child => getTabId(child));
  const tabsetName = options.tabset || generateAnonymousTabsetName(tabIds);
  const [activeTab, setActiveTabIndex] = useState(0);
  const previousTabsetChoice = activeTabs[tabsetName];
  // Hide tabset if it includes the :hidden: option, or if it is controlled by a dropdown selector
  const isHidden = options.hidden || Object.keys(selectors).includes(tabsetName);
  const temp = page?.options?.template;
  const isLanding = temp === 'landing';

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
    <StyledTabs as={TabButton} isHidden={isHidden} isLanding={isLanding} selected={activeTab} setSelected={handleClick}>
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
          <LeafyTab className={cx(styleTab(isLanding))} key={tabId} name={tabTitle}>
            {tab.children.map((child, i) => (
              <ComponentFactory {...rest} key={`${tabId}-${i}`} nodeData={child} />
            ))}
          </LeafyTab>
        );
      })}
    </StyledTabs>
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
