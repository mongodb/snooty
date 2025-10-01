import React, { useContext, useMemo } from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import Select from '../Select';
import { reportAnalytics } from '../../utils/report-analytics';
import { DRIVER_ICON_MAP, DriverMap } from '../icons/DriverIconMap';
import { theme } from '../../theme/docsTheme';
import { PageContext } from '../../context/page-context';
import { ASTNode } from '../../types/ast';
import { ActiveTabs, TabContext } from './tab-context';
import { makeChoices } from './make-choices';

const selectStyle = css`
  width: 100%;

  & button > div > div > div {
    display: flex;
    align-items: center;
  }

  @media ${theme.screenSize.smallAndUp} {
    /* Min width of right panel */
    max-width: 140px;
  }

  @media ${theme.screenSize.upToLarge} {
    /* Supports the alignment when on tablet or mobile */
    max-width: 300px;
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

const capitalizeFirstLetter = (str: string) => str.trim().replace(/^\w/, (c) => c.toUpperCase());

const getLabel = (name: string) => {
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

export type TabSelectorProps = {
  activeTab: string;
  handleClick: (activeTab: ActiveTabs) => void;
  iconMapping: DriverMap;
  name: string;
  options: Record<string, ASTNode[]>;
  mainColumn: boolean;
  className?: string;
};

const TabSelector = ({
  className,
  activeTab,
  handleClick,
  iconMapping,
  name,
  options,
  mainColumn,
}: TabSelectorProps) => {
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
        reportAnalytics('Click', {
          properties: {
            position: 'selector/dropdown',
            position_context: 'language selection',
            label: value,
          },
        });
      }}
      value={activeTab}
    />
  );
};

export type TabSelectorsProps = {
  className?: string;
  rightColumn?: boolean;
};

const TabSelectors = ({ className, rightColumn = false }: TabSelectorsProps) => {
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
            mainColumn={!!tabsMainColumn}
          />
        );
      })}
    </>
  );
};

export default TabSelectors;
