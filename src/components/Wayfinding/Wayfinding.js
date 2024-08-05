import React, { useMemo, useState } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { Body } from '@leafygreen-ui/typography';
import Icon from '@leafygreen-ui/icon';
import { theme } from '../../theme/docsTheme';
import ComponentFactory from '../ComponentFactory';
import { getPlaintext } from '../../utils/get-plaintext';
import WayfindingOption from './WayfindingOption';

export const MAX_INIT_OPTIONS = 4;
const CHILD_DESCRIPTION_NAME = 'wayfinding-description';
const CHILD_OPTION_NAME = 'wayfinding-option';

const containerStyle = css`
  width: 100%;
  border-radius: 24px;
  border: 1px solid var(--wayfinding-border-color);
  background-color: var(--wayfinding-bg-color);
  padding: 24px 32px;
`;

const titleStyle = css`
  margin-bottom: 2px;
  font-weight: 600;
  color: var(--font-color-primary);
`;

// Style attempts to overwrite child nodes to get them to conform to wayfinding styling
const descriptionStyle = css`
  * {
    font-size: ${theme.fontSize.small} !important;
    line-height: 20px !important;
  }

  *:last-child {
    margin-bottom: 0 !important;
  }
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

const showAllButtonStyle = css`
  background-color: inherit;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--link-color-primary);
  font-size: 13px;
  line-height: 20px;
`;

const getWayfindingComponents = (children) => {
  const descriptionNodeIdx = children.findIndex(({ name }) => name === CHILD_DESCRIPTION_NAME);
  const [descriptionNode] = descriptionNodeIdx >= 0 ? children.splice(descriptionNodeIdx, 1) : [];
  return {
    descriptionNode,
    optionNodes: children,
  };
};

const Wayfinding = ({ nodeData: { children, argument } }) => {
  const [showAll, setShowAll] = useState(false);
  const { descriptionNode, optionNodes } = useMemo(() => {
    // Create copy of children to avoid issues with hot reload
    return getWayfindingComponents([...children]);
  }, [children]);
  const titleText = getPlaintext(argument);

  const { showButtonText, showButtonGlyph } = showAll
    ? {
        showButtonText: 'Collapse',
        showButtonGlyph: 'ChevronUp',
      }
    : {
        showButtonText: 'Show all',
        showButtonGlyph: 'ChevronDown',
      };

  return (
    <div className={cx(containerStyle)}>
      <Body className={titleStyle}>{titleText}</Body>
      <div className={cx(descriptionStyle)}>
        {descriptionNode?.children?.map((child, index) => {
          return <ComponentFactory key={index} nodeData={child} />;
        })}
      </div>
      <div className={cx(optionsContainerStyle)}>
        {optionNodes.map((option, index) => {
          if (option.name !== CHILD_OPTION_NAME) {
            return null;
          }
          const shouldHideOption = !showAll && index > MAX_INIT_OPTIONS - 1;
          return <WayfindingOption key={index} hideOption={shouldHideOption} nodeData={option} />;
        })}
      </div>
      {optionNodes.length > MAX_INIT_OPTIONS && (
        <button className={cx(showAllButtonStyle)} onClick={() => setShowAll((prev) => !prev)}>
          {showButtonText}
          <Icon glyph={showButtonGlyph} />
        </button>
      )}
    </div>
  );
};

export default Wayfinding;
