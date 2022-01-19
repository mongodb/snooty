import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { cx, css as LeafyCss } from '@leafygreen-ui/emotion';
import { css } from '@emotion/core';
import Icon from '@leafygreen-ui/icon';
import Button from '@leafygreen-ui/button';
import styled from '@emotion/styled';
import { theme } from '../theme/docsTheme';

const outputButtonStyling = LeafyCss`
  padding: 0px;
  font-size: 12px;
  height: 24px;
  margin: 8px;
  font-weight: bold;
`;

const CodeIO = ({ nodeData: { children }, ...rest }) => {
  const [showOutput, setShowOutput] = useState('none');
  const [buttonText, setButtonText] = useState('VIEW OUTPUT');
  const [arrow, setArrow] = useState('ChevronDown');
  let outputExists = showOutput === 'none' ? '4px' : '0px';

  const handleClick = (e) => {
    if (showOutput === 'inline') {
      setShowOutput('none');
      setButtonText('VIEW OUTPUT');
      setArrow('ChevronDown');
    } else {
      setShowOutput('inline');
      setButtonText('HIDE OUTPUT');
      setArrow('ChevronUp');
    }
  };

  return (
    <div
      css={css`
        display: table;
        margin: ${theme.size.default} 0;
        min-width: 150px;
        table-layout: fixed;
        width: 100%;

        // Inner div of LG component has a width set to 700px. Unset this as part of our
        // override for docs when the language switcher is being used.
        > div > div {
          width: unset;
          border-radius: 0px;
        }

        > div {
          border-top-right-radius: 0px;
          border-top-left-radius: 0px;
          border-bottom-right-radius: ${outputExists};
          border-bottom-left-radius: ${outputExists};
          margin: 0px;
        }

        // Override default LG Code language switcher font size
        button > div > div {
          font-size: ${theme.fontSize.default};
        }
      `}
    >
      <ComponentFactory {...rest} nodeData={children[0]} />
      <IOToggle>
        <Button
          className={cx(outputButtonStyling)}
          darkMode={false}
          disabled={false}
          onClick={handleClick}
          leftGlyph={<Icon glyph={arrow} fill="#FF0000" />}
        >
          {buttonText}
        </Button>
      </IOToggle>
      {showOutput === 'inline' && <ComponentFactory {...rest} nodeData={children[1]} />}
      {children.length !== 2 && children.map((child, i) => <ComponentFactory {...rest} key={i} nodeData={child} />)}
    </div>
  );
};

const IOToggle = styled.div`
  border: 1px solid #e7eeec;
  border-top: none;
`;

CodeIO.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default CodeIO;
