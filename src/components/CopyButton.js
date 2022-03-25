/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { uiColors } from '@leafygreen-ui/palette';
import useCopyClipboard from '../hooks/useCopyClipboard';

const getCopyButtonStyle = (copied) => {
  const baseStyle = css`
    align-self: center;
    color: ${uiColors.gray.base};
  `;

  if (copied) {
    return css`
      ${baseStyle};
      color: ${uiColors.white};
      background-color: ${uiColors.green.base};
      &:focus,
      &:hover {
        color: ${uiColors.white};
        &:before {
          background-color: ${uiColors.green.base};
        }
      }
    `;
  }

  return baseStyle;
};

// Component based on the copy button used in LeafyGreen's Code component
// https://github.com/mongodb/leafygreen-ui/blob/25a0dddc55ff41f8dbcce757df83ca26743c3adb/packages/code/src/CopyButton.tsx
const CopyButton = ({ contents, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const [buttonNode, setButtonNode] = useState(null);

  useCopyClipboard(copied, setCopied, buttonNode, contents);

  const handleClick = (e) => {
    e.preventDefault();

    if (onCopy) {
      onCopy();
    }

    setCopied(true);
  };

  return (
    <IconButton ref={setButtonNode} aria-label="Copy" css={getCopyButtonStyle(copied)} onClick={handleClick}>
      {copied ? <Icon glyph="Checkmark" /> : <Icon glyph="Copy" />}
    </IconButton>
  );
};

CopyButton.propTypes = {
  contents: PropTypes.string.isRequired,
  onCopy: PropTypes.func,
};

export default CopyButton;
