import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Tabs as LeafyTabs, Tab as LeafyTab } from '@leafygreen-ui/tabs';
import ComponentFactory from './ComponentFactory';
import { TabContext } from './tab-context';
import { reportAnalytics } from '../utils/report-analytics';
import { getNestedValue } from '../utils/get-nested-value';
import { isBrowser } from '../utils/is-browser';

const getTabId = (node) => getNestedValue(['options', 'tabid'], node);

// Name anonymous tabsets by alphabetizing their tabids and concatenating with a forward slash
const generateAnonymousTabsetName = (tabIds) => [...tabIds].sort().join('/');

const getPosition = (element) => {
  if (!isBrowser || !element) return { x: 0, y: 0 };
  const { x, y } = element.getBoundingClientRect();
  return { x, y };
};

const TabButton = ({ ...props }) => <button {...props} />;

const hiddenTabStyling = css`
  & > div:first-child {
    display: none;
  }
`;

const StyledTabs = styled(LeafyTabs)`
  ${({ isHidden }) => isHidden && hiddenTabStyling};
`;

const Tabs = ({ nodeData: { children, options = {} }, ...rest }) => {
  const { activeTabs, selectors, setActiveTab } = useContext(TabContext);
  const tabIds = children.map((child) => getTabId(child));
  const tabsetName = options.tabset || generateAnonymousTabsetName(tabIds);
  const [activeTab, setActiveTabIndex] = useState(0);

  const scrollAnchorRef = useRef();
  const previousTabsetChoice = activeTabs[tabsetName];
  // Hide tabset if it includes the :hidden: option, or if it is controlled by a dropdown selector
  const isHidden = options.hidden || Object.keys(selectors).includes(tabsetName);

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
    (index) => {
      const tabId = tabIds[index];

      const offsetY = window.scrollY - getPosition(scrollAnchorRef.current).y;

      setActiveTab({
        name: tabsetName,
        value: tabId,
      });
      reportAnalytics('Tab Selected', {
        tabId,
        tabSet: tabsetName,
      });

      window.setTimeout(() => {
        window.scrollTo(0, getPosition(scrollAnchorRef.current).y + offsetY);
      }, 40);

      // setPosition(getPosition(scrollAnchorRef.current).y);
    },
    [setActiveTab, tabIds, tabsetName] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <>
      <div ref={scrollAnchorRef} aria-hidden="true"></div>
      <StyledTabs as={TabButton} isHidden={isHidden} selected={activeTab} setSelected={handleClick}>
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
              {tab.children.map((child, i) => (
                <ComponentFactory {...rest} key={`${tabId}-${i}`} nodeData={child} />
              ))}
            </LeafyTab>
          );
        })}
      </StyledTabs>
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
