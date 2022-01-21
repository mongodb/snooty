import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';
import { cx, css as LeafyCss } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import Button from '@leafygreen-ui/button';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { baseCodeStyle, borderCodeStyle } from './styles/codeStyle';

const outputButtonStyling = LeafyCss`
  padding: 0px;
  font-size: 12px;
  height: 24px;
  margin: 8px;
  font-weight: bold;
`;

const CodeIO = ({ nodeData: { children }, ...rest }) => {
  const [showOutput, setShowOutput] = useState(false);
  const [buttonText, setButtonText] = useState('VIEW OUTPUT');
  const [arrow, setArrow] = useState('ChevronDown');
  const outputExists = !showOutput ? '4px' : '0px';

  const handleClick = (e) => {
    if (showOutput) {
      setShowOutput(false);
      setButtonText('VIEW OUTPUT');
      setArrow('ChevronDown');
    } else {
      setShowOutput(true);
      setButtonText('HIDE OUTPUT');
      setArrow('ChevronUp');
    }
  };

  return (
    <div
      css={css`
        ${baseCodeStyle}

        // Inner div of LG component has a width set to 700px. Unset this as part of our
        // override for docs when the language switcher is being used.
        > div > div {
          border-bottom-right-radius: 0px;
          border-bottom-left-radius: 0px;
        }

        // Controls output code block style
        > div {
          border-top-right-radius: 0px;
          border-top-left-radius: 0px;
          border-bottom-right-radius: ${outputExists};
          border-bottom-left-radius: ${outputExists};
          margin: 0px;
        }
      `}
    >
      {children.length === 2 && (
        <>
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
        </>
      )}
      {showOutput && <ComponentFactory {...rest} nodeData={children[1]} />}
      {children.length !== 2 && children.map((child, i) => <ComponentFactory {...rest} key={i} nodeData={child} />)}
    </div>
  );
};

const IOToggle = styled.div`
  ${borderCodeStyle}
  border-top: none;
`;

CodeIO.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default CodeIO;
