import React from 'react';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';

export default function CloseButton({ onClick, size = 'default', ...props }) {
  return (
    <IconButton aria-label="Close Feedback Form" onClick={onClick} size={size} {...props}>
      <Icon size={size} glyph="X" />
    </IconButton>
  );
}
