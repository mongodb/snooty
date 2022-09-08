import React from 'react';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { palette } from '@leafygreen-ui/palette';

const CloseButton = ({ onClick, size = 'default', ...props }) => {
  return (
    <IconButton aria-label="Close Feedback Form" onClick={onClick} size={size} fill={palette.gray.light1} {...props}>
      <Icon size={size} glyph="X" />
    </IconButton>
  );
};

export default CloseButton;
