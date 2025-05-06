import React, { useEffect, useState, useContext } from 'react';
import { RadioBox, RadioBoxGroup } from '@leafygreen-ui/radio-box-group';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import { getLocalValue, setLocalValue } from '../../utils/browser-storage';
import { reportAnalytics } from '../../utils/report-analytics';
import { ContentsContext } from '../Contents/contents-context';
import { isOfflineDocsBuild } from '../../utils/is-offline-docs-build';
import { OFFLINE_METHOD_SELECTOR_CLASSNAME } from '../../utils/head-scripts/offline-ui/method-selector';
import MethodOptionContent from './MethodOptionContent';

const STORAGE_KEY = 'methodSelectorId';
// Padding to help selected option's box shadow stay visible while keeping overflow hidden for container
const OPTIONS_GRID_PADDING = '3px';
const OPTIONS_GAP = theme.size.default;

// Provides enough height for 2 rows of method options. Allows the decorative line to be hidden
// when the options start wrapping
const optionsContainer = css`
  @media ${theme.screenSize.mediumAndUp} {
    max-height: 120px;
    overflow: hidden;
  }
`;

const radioBoxGroupStyle = (count) => css`
  // Use grid to help keep all options the same size while allowing for stretching
  display: grid;
  grid-template-columns: repeat(${count > 3 ? 2 : 1}, minmax(0, 1fr));
  gap: ${OPTIONS_GAP};
  margin-bottom: ${theme.size.medium};
  padding: ${OPTIONS_GRID_PADDING};
  padding-bottom: 0px;

  @media ${theme.screenSize.mediumAndUp} {
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  }

  @media ${theme.screenSize.largeAndUp} {
    // Setting min width to get options in one row on desktop size when side nav is closed
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  }
`;

const radioBoxStyle = css`
  height: 48px;
  margin: 0;

  div {
    // Reduce padding to allow boxes to fit better on tablet screen sizes
    padding: 14px 12px;
    background-color: inherit;
    color: inherit;

    ${isOfflineDocsBuild &&
    `
      border-color: ${palette.gray.base};
      box-shadow: none;
    `}
  }

  ${isOfflineDocsBuild &&
  `
    &[aria-selected=true] div {
      border-color: transparent;
      box-shadow: 0 0 0 3px ${palette.green.dark1};
    }
  `}

  :not(:last-of-type) {
    margin: 0;
  }
`;

const lineStyle = css`
  display: none;

  @media ${theme.screenSize.mediumAndUp} {
    display: block;
  }
`;

/**
 * Handles the CSS calculations for the triangle to point to the selected method. Assumes the calculation
 * starts from the lefthand side, relative to an element that is the full width of the content column.
 * @param {number} count
 * @param {number} selectedIdx
 * @returns {string}
 */
const trianglePosCalc = (count, selectedIdx) => {
  const numGaps = `${count - 1} * ${OPTIONS_GAP}`;
  const fullHorizontalPadding = `${OPTIONS_GRID_PADDING} * 2`;
  const widthOfOneOption = `(100% - ${fullHorizontalPadding} - ${numGaps}) / ${count}`;
  const skipOptions = `${selectedIdx} * (${OPTIONS_GAP} + ${widthOfOneOption})`;
  return `calc(${OPTIONS_GRID_PADDING} + ${skipOptions} + (${widthOfOneOption} / 2))`;
};

const triangleStyle = (count, selectedIdx = 0) => css`
  position: relative;

  ::before {
    content: '';
    height: 0;
    width: 0;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-bottom: 11px solid ${palette.green.dark1};
    position: absolute;
    left: ${trianglePosCalc(count, selectedIdx)};
    bottom: 0px;
    transform: translateX(-50%);
  }
`;

const hrStyle = css`
  border: 1.5px solid ${palette.green.dark1};
  margin: 0;
`;

const MethodSelector = ({ nodeData: { children } }) => {
  const optionCount = children.length;
  const [selectedMethod, setSelectedMethod] = useState(children[0]?.options?.id);
  const { activeSelectorIds, setActiveSelectorIds } = useContext(ContentsContext);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // set on initial load
  // Load method ID saved from last session, if applicable.
  useEffect(() => {
    const savedMethodId = getLocalValue(STORAGE_KEY);
    const validOptions = children.reduce((arr, child) => {
      arr.push(child?.options?.id);
      return arr;
    }, []);

    if (savedMethodId && validOptions.includes(savedMethodId)) {
      setSelectedMethod(savedMethodId);
      setSelectedIdx(validOptions.indexOf(savedMethodId));
      if (activeSelectorIds?.methodSelector !== savedMethodId)
        setActiveSelectorIds({ ...activeSelectorIds, methodSelector: savedMethodId });
    } else if (activeSelectorIds?.methodSelector !== children[0]?.options?.id) {
      setActiveSelectorIds({ ...activeSelectorIds, methodSelector: children[0]?.options?.id });
    }
  }, [activeSelectorIds, setActiveSelectorIds, children]);

  return (
    <>
      <div className={cx(optionsContainer, isOfflineDocsBuild ? OFFLINE_METHOD_SELECTOR_CLASSNAME : '')}>
        <RadioBoxGroup
          className={cx(radioBoxGroupStyle(children.length))}
          size={'full'}
          onChange={({ target: { defaultValue } }) => {
            const [id, idx] = defaultValue.split('-');
            setSelectedMethod(id);
            setActiveSelectorIds({ ...activeSelectorIds, methodSelector: id });
            setSelectedIdx(idx);
            setLocalValue(STORAGE_KEY, id);
            reportAnalytics('MethodOptionSelected', {
              methodOption: defaultValue,
            });
          }}
        >
          {children.map(({ options: { title, id } }, index) => {
            return (
              <RadioBox
                id={id}
                key={id}
                className={cx(radioBoxStyle)}
                value={`${id}-${index}`}
                checked={selectedMethod === id}
                aria-selected={isOfflineDocsBuild ? selectedMethod === id : null}
              >
                {title}
              </RadioBox>
            );
          })}
        </RadioBoxGroup>
        {/* Keep separate div for triangle to allow for relative positioning */}
        {/* Offline docs will not have this triangle indicator */}
        {!isOfflineDocsBuild && (
          <div className={cx(lineStyle)}>
            <div className={cx(triangleStyle(optionCount, selectedIdx))} />
            <hr className={cx(hrStyle)} />
          </div>
        )}
      </div>
      {children.map((child, index) => {
        if (child.name !== 'method-option') return null;
        return <MethodOptionContent key={index} nodeData={child} selectedMethod={selectedMethod} />;
      })}
    </>
  );
};

export default MethodSelector;
