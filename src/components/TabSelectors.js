import React, { useContext } from 'react';
import { css } from '@emotion/core';
import { TabContext } from './tab-context';
import Select from './Select';
import { getPlaintext } from '../utils/get-plaintext';
import { theme } from '../theme/docsTheme';

const capitalizeFirstLetter = str => str.trim().replace(/^\w/, c => c.toUpperCase());

const getLabel = name => {
  switch (name) {
    case 'drivers':
      return 'Select your language';
    case 'deployments':
      return 'Select your deployment type';
    case 'platforms':
      return 'Select your platform';
    default:
      capitalizeFirstLetter(name);
  }
};

const TabSelectors = () => {
  const { activeTabs, selectors, setActiveTab } = useContext(TabContext);

  if (!selectors || Object.keys(selectors).length === 0) {
    return null;
  }

  return (
    <>
      {Object.entries(selectors).map(([name, options], i) => {
        const choices = Object.entries(options).map(([tabId, title]) => ({ text: getPlaintext(title), value: tabId }));
        return (
          <Select
            css={css`
              width: 100%;

              @media ${theme.screenSize.smallAndUp} {
                /* Min width of right panel */
                max-width: 180px;
              }
            `}
            choices={choices}
            key={i}
            label={getLabel(name)}
            onChange={({ value }) => {
              setActiveTab({ name, value });
            }}
            value={activeTabs[name]}
          />
        );
      })}
    </>
  );
};

export default TabSelectors;
