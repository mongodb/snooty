import React, { useContext, useMemo } from 'react';
import { css } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { TabContext } from './tab-context';
import Select from './Select';
import { getPlaintext } from '../utils/get-plaintext';
import { reportAnalytics } from '../utils/report-analytics';

import IconC from './icons/C';
import IconCompass from './icons/Compass';
import IconCpp from './icons/Cpp';
import IconCsharp from './icons/Csharp';
import IconGo from './icons/Go';
import IconJava from './icons/Java';
import IconNode from './icons/Node';
import IconPHP from './icons/Php';
import IconPython from './icons/Python';
import IconRuby from './icons/Ruby';
import IconRust from './icons/Rust';
import IconScala from './icons/Scala';
import IconShell from './icons/Shell';
import IconSwift from './icons/Swift';

const capitalizeFirstLetter = str => str.trim().replace(/^\w/, c => c.toUpperCase());

const driverIconMap = {
  c: IconC,
  compass: IconCompass,
  cpp: IconCpp,
  csharp: IconCsharp,
  go: IconGo,
  'java-sync': IconJava,
  'java-async': IconJava,
  nodejs: IconNode,
  php: IconPHP,
  python: IconPython,
  ruby: IconRuby,
  rust: IconRust,
  scala: IconScala,
  shell: IconShell,
  'swift-async': IconSwift,
  'swift-sync': IconSwift,
};

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

const makeChoices = ({ name, options }) =>
  Object.entries(options).map(([tabId, title]) => ({
    text: getPlaintext(title),
    value: tabId,
    ...(name === 'drivers' && { icon: driverIconMap[tabId] }),
  }));

const TabSelector = ({ activeTab, handleClick, name, options }) => {
  const choices = useMemo(() => makeChoices({ name, options }), [name, options]);
  const { screenSize } = useTheme();
  return (
    <Select
      css={css`
        width: 100%;

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
      {Object.entries(selectors).map(([name, options]) => (
        <TabSelector key={name} activeTab={activeTabs[name]} handleClick={setActiveTab} name={name} options={options} />
      ))}
    </>
  );
};

export default TabSelectors;
