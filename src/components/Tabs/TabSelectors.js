import React, { useContext, useMemo } from 'react';
import { useTheme, css } from '@emotion/react';
import Select from '../Select';
import { getPlaintext } from '../../utils/get-plaintext';
import { reportAnalytics } from '../../utils/report-analytics';
import { DRIVER_ICON_MAP } from '../icons/DriverIconMap';
import { TabContext } from './tab-context';

const capitalizeFirstLetter = (str) => str.trim().replace(/^\w/, (c) => c.toUpperCase());

const getLabel = (name) => {
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

export const makeChoices = ({ name, iconMapping, options }) =>
  Object.entries(options).map(([tabId, title]) => ({
    text: getPlaintext(title),
    value: tabId,
    ...(name === 'drivers' && { tabSelectorIcon: iconMapping[tabId] }),
  }));

const TabSelector = ({ activeTab, handleClick, iconMapping, name, options }) => {
  const choices = useMemo(() => makeChoices({ name, iconMapping, options }), [name, iconMapping, options]);
  const { screenSize } = useTheme();
  return (
    <Select
      css={css`
        width: 100%;

        & button > div > div > div {
          display: flex;
          align-items: center;
        }

        @media ${screenSize.smallAndUp} {
          /* Min width of right panel */
          max-width: 180px;
        }
      `}
      choices={choices}
      label={getLabel(name)}
      onChange={({ value }) => {
        handleClick({ name, value });
        reportAnalytics('LanguageSelection', {
          areaFrom: 'LanguageSelector',
          languageInitial: activeTab,
          languageSelected: value,
        });
      }}
      value={activeTab}
    />
  );
};

const TabSelectors = () => {
  const { activeTabs, selectors, setActiveTab } = useContext(TabContext);

  if (!selectors || Object.keys(selectors).length === 0) {
    return null;
  }

  return (
    <>
      {Object.entries(selectors).map(([name, options]) => {
        let iconMapping = {};
        if (name === 'drivers') {
          iconMapping = DRIVER_ICON_MAP;
        }

        return (
          <TabSelector
            key={name}
            activeTab={activeTabs[name]}
            handleClick={setActiveTab}
            iconMapping={iconMapping}
            name={name}
            options={options}
          />
        );
      })}
    </>
  );
};

export default TabSelectors;
