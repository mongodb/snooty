import React, { useContext, useMemo } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import Select from '../Select';
import { reportAnalytics } from '../../utils/report-analytics';
import { DRIVER_ICON_MAP } from '../icons/DriverIconMap';
import { theme } from '../../theme/docsTheme';
import { PageContext } from '../../context/page-context';
import { TabContext } from './tab-context';
import { makeChoices } from './make-choices';

const selectStyle = css`
  width: 100%;

  & button > div > div > div {
    display: flex;
    align-items: center;
  }

  @media ${theme.screenSize.smallAndUp} {
    /* Min width of right panel */
    max-width: 180px;
  }
`;

const mainColumnStyles = css`
  margin: ${theme.size.large} 0px;
  div > button {
    display: flex;
    width: 458px;
    @media ${theme.screenSize.upToMedium} {
      width: 385px;
    }
    @media ${theme.screenSize.upToSmall} {
      width: 100%;
    }
  }
`;

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

const TabSelector = ({ className, activeTab, handleClick, iconMapping, name, options, mainColumn }) => {
  const choices = useMemo(() => makeChoices({ name, iconMapping, options }), [name, iconMapping, options]);
  // usePortal set to true when Select is in main column to
  // prevent z-index issues with content overlapping dropdown
  return (
    <Select
      className={cx(selectStyle, mainColumn ? mainColumnStyles : '', className)}
      choices={choices}
      label={getLabel(name)}
      usePortal={mainColumn}
      onChange={({ value }) => {
        handleClick({ [name]: value });
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

const TabSelectors = ({ className, rightColumn }) => {
  const { tabsMainColumn } = useContext(PageContext);
  const { activeTabs, selectors, setActiveTab } = useContext(TabContext);

  if (!selectors || Object.keys(selectors).length === 0 || (!tabsMainColumn && !rightColumn)) {
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
            className={className}
            activeTab={activeTabs[name]}
            handleClick={setActiveTab}
            iconMapping={iconMapping}
            name={name}
            options={options}
            mainColumn={tabsMainColumn}
          />
        );
      })}
    </>
  );
};

export default TabSelectors;
