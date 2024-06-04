import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { cx, css as LeafyCss } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import Button from '@leafygreen-ui/button';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import Input from '../Code/Input';
import Output from '../Code/Output';
import { baseCodeStyle, borderCodeStyle } from './styles/codeStyle';

const outputButtonStyling = LeafyCss`
  padding: 0px;
  height: 24px;
  margin: 8px;
`;

const CodeIO = ({ nodeData: { children }, ...rest }) => {
  const { darkMode } = useDarkMode();
  const needsIOToggle = children.length === 2;
  const onlyInputSpecified = children.length === 1;

  let initialOutputVisibility = true;
  if (needsIOToggle && children[1]?.options?.visible !== undefined) {
    initialOutputVisibility = !!children[1].options.visible;
  }
  const [showOutput, setShowOutput] = useState(initialOutputVisibility);
  const buttonText = showOutput ? 'HIDE OUTPUT' : 'VIEW OUTPUT';
  const arrow = showOutput ? 'ChevronUp' : 'ChevronDown';
  const outputBorderRadius = !showOutput ? '12px' : '0px';
  const singleInputBorderRadius = onlyInputSpecified ? '12px' : '0px';

  const handleClick = (e) => {
    if (showOutput) {
      setShowOutput(false);
    } else {
      setShowOutput(true);
    }
  };

  if (children.length === 0) {
    return null;
  }

  return (
    <div
      css={css`
        ${baseCodeStyle}
        // Inner div of LG component has a width set to 700px. Unset this as part of our
        // override for docs when the language switcher is being used.
        > div > div {
          border-bottom-right-radius: ${singleInputBorderRadius};
          border-bottom-left-radius: ${singleInputBorderRadius};
        }

        // Controls output code block and toggle view bar style
        > div {
          border-bottom-right-radius: ${outputBorderRadius};
          border-bottom-left-radius: ${outputBorderRadius};
          margin: 0px;
        }
      `}
    >
      {needsIOToggle && (
        <>
          <Input nodeData={children[0]} />
          <IOToggle style={{ borderColor: darkMode ? palette.gray.dark2 : palette.gray.light2 }}>
            <Button
              role="button"
              className={cx(outputButtonStyling)}
              disabled={false}
              onClick={handleClick}
              leftGlyph={<Icon glyph={arrow} fill="#FF0000" />}
            >
              {buttonText}
            </Button>
          </IOToggle>
          {showOutput && <Output nodeData={children[1]} />}
        </>
      )}
      {onlyInputSpecified && <Input nodeData={children[0]} />}
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
