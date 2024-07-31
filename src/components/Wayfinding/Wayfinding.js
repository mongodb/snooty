import React, { useState } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { Body } from '@leafygreen-ui/typography';
import { theme } from '../../theme/docsTheme';
import WayfindingOption from './WayfindingOption';

const TITLE_TEXT = 'MongoDB with drivers';
const DESCRIPTION_TEXT =
  'This page documents a mongosh method. To view the equivalent method in a MongoDB driver, visit the drivers page for your programming language';

const containerStyle = css`
  width: 100%;
  border-radius: 24px;
  border: 1px solid ${palette.gray.light2};
  background-color: ${palette.gray.light3};
  padding: 24px 32px;
`;

const titleStyle = css`
  margin-bottom: 2px;
  font-weight: 600;
`;

const optionsContainerStyle = css`
  margin: 16px 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, 164px);
  gap: 8px 6px;

  @media ${theme.screenSize.upToSmall} {
    grid-template-columns: repeat(auto-fill, 133px);
  }
`;

const Wayfinding = ({ nodeData: { children } }) => {
  const [showAll, setShowAll] = useState(false);
  const maxInitialOptions = 4;

  const priorityOptions = children.slice(0, maxInitialOptions);
  const otherOptions = children.slice(maxInitialOptions);

  const showButtonText = showAll ? 'Collapse' : 'Show all';

  const renderWayfindingOptions = (option) => {
    if (option.name !== 'wayfinding-option') {
      return null;
    }
    return <WayfindingOption nodeData={option}>option</WayfindingOption>;
  };

  return (
    <div className={cx(containerStyle)}>
      <Body className={titleStyle}>{TITLE_TEXT}</Body>
      <Body baseFontSize={13}>{DESCRIPTION_TEXT}</Body>
      <div className={cx(optionsContainerStyle)}>
        {priorityOptions.map(renderWayfindingOptions)}
        {showAll && otherOptions.map(renderWayfindingOptions)}
      </div>
      {children.length > maxInitialOptions && <div onClick={() => setShowAll((prev) => !prev)}>{showButtonText}</div>}
    </div>
  );
};

export default Wayfinding;
