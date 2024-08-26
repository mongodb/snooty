import React, { useEffect, useState } from 'react';
import { RadioBox, RadioBoxGroup } from '@leafygreen-ui/radio-box-group';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import { getLocalValue, setLocalValue } from '../../utils/browser-storage';
import { reportAnalytics } from '../../utils/report-analytics';
import MethodOptionContent from './MethodOptionContent';

const STORAGE_KEY = 'methodSelectorId';

const radioBoxGroupStyle = (count) => css`
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

const radioBoxStyle = css`
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
`;

const MethodSelector = ({ nodeData: { children } }) => {
  const [selectedMethod, setSelectedMethod] = useState(children[0]?.options?.id);

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
            <RadioBox key={id} className={cx(radioBoxStyle)} value={id} checked={selectedMethod === id}>
              {title}
            </RadioBox>
          );
        })}
      </RadioBoxGroup>
      {children.map((child, index) => {
        if (child.name !== 'method-option') return null;
        return <MethodOptionContent key={index} nodeData={child} selectedMethod={selectedMethod} />;
      })}
    </>
  );
};

export default MethodSelector;
