import React, { useContext, useEffect, useState } from 'react';
import { RadioBox, RadioBoxGroup } from '@leafygreen-ui/radio-box-group';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import { getLocalValue, setLocalValue } from '../../utils/browser-storage';
import { reportAnalytics } from '../../utils/report-analytics';
import { SidenavContext } from '../Sidenav';
import MethodOptionContent from './MethodOptionContent';

const STORAGE_KEY = 'methodSelectorId';

/**
 * Helper function to determine if options will wrap or not
 * @param {number} count
 * @returns {string}
 */
const whenWrappingDesktop = (count) => {
  // Hardcoding this will make it easier to have accurate media queries, without relying on client-side JS and potentially
  // creating content layout shifts.
  // Only wraps when there's 4+ options are found
  const singleRowScreenSizeBP = {
    4: 1028,
    5: 1134,
    6: 1240,
  };
  return `@media only screen and (min-width: ${theme.breakpoints.large + 1}px) and (max-width: ${
    singleRowScreenSizeBP[count] - 1
  }px)`;
};

const radioBoxGroupStyle = (count) => css`
  // Use grid to help keep all options the same size while allowing for stretching
  display: grid;
  grid-template-columns: repeat(${count > 3 ? 2 : 1}, minmax(0, 1fr));
  gap: ${theme.size.default};
  margin-bottom: ${theme.size.medium};
  // Force component to hit content's max width on pages that have minimal content
  max-width: 100vw;

  @media ${theme.screenSize.mediumAndUp} {
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  }

  @media ${theme.screenSize.largeAndUp} {
    // Setting min width to get options in one row on desktop size when side nav is closed
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  }
`;

const radioBoxStyle = (isSelected, count, isSidenavCollapsed) => css`
  height: 48px;
  margin: 0;

  div {
    // Reduce padding to allow boxes to fit better on tablet screen sizes
    padding: 14px 12px;
    background-color: inherit;
    color: inherit;
  }

  :not(:last-of-type) {
    margin: 0;
  }

  @media ${theme.screenSize.mediumAndUp} {
    ::after {
      content: '';
      height: 0;
      width: 0;
      border-left: 11px solid transparent;
      border-right: 11px solid transparent;
      border-bottom: 11px solid ${isSelected ? palette.green.dark1 : 'transparent'};
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -${theme.size.medium};
    }
  }

  ${!isSidenavCollapsed &&
  `
    ${whenWrappingDesktop(count)} {
      ::after {
        content: none;
      }
    }
  `}
`;

const hrStyle = (count, isSidenavCollapsed) => css`
  display: none;

  @media ${theme.screenSize.mediumAndUp} {
    border: 1.5px solid ${palette.green.dark1};
    margin: ${theme.size.medium} 0;
    display: block;
  }

  ${!isSidenavCollapsed &&
  `
    ${whenWrappingDesktop(count)} {
      display: none;
    }
  `}
`;

const MethodSelector = ({ nodeData: { children } }) => {
  const optionCount = children.length;
  const [selectedMethod, setSelectedMethod] = useState(children[0]?.options?.id);
  const { isCollapsed: isSidenavCollapsed } = useContext(SidenavContext);

  // Load method ID saved from last session, if applicable.
  useEffect(() => {
    const savedMethodId = getLocalValue(STORAGE_KEY);
    const validOptions = children.reduce((arr, child) => {
      arr.push(child?.options?.id);
      return arr;
    }, []);

    if (savedMethodId && validOptions.includes(savedMethodId)) {
      setSelectedMethod(savedMethodId);
    }
  }, [children]);

  return (
    <>
      <RadioBoxGroup
        className={cx(radioBoxGroupStyle(children.length))}
        size={'full'}
        onChange={({ target: { defaultValue } }) => {
          setSelectedMethod(defaultValue);
          setLocalValue(STORAGE_KEY, defaultValue);
          reportAnalytics('MethodOptionSelected', {
            methodOption: defaultValue,
          });
        }}
      >
        {children.map(({ options: { title, id } }) => {
          return (
            <RadioBox
              key={id}
              className={cx(radioBoxStyle(selectedMethod === id, optionCount, isSidenavCollapsed))}
              value={id}
              checked={selectedMethod === id}
            >
              {title}
            </RadioBox>
          );
        })}
      </RadioBoxGroup>
      <hr className={cx(hrStyle(optionCount, isSidenavCollapsed))} />
      {children.map((child, index) => {
        if (child.name !== 'method-option') return null;
        return <MethodOptionContent key={index} nodeData={child} selectedMethod={selectedMethod} />;
      })}
    </>
  );
};

export default MethodSelector;
