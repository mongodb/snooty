import React from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../../../theme/docsTheme';
import { CLOSE_BUTTON_ALT_TEXT } from '../constants';

const buttonStyles = css`
  position: absolute;
  top: ${theme.size.default};
  right: ${theme.size.default};
  height: ${theme.size.default};
  width: ${theme.size.default};

  @media ${theme.screenSize.upToSmall} {
    top: ${theme.size.default};
    right: ${theme.size.medium};
  }
`;

const CloseButton = ({ onClick, size = 'default', className, ...props }) => {
  return (
    <IconButton
      aria-label={CLOSE_BUTTON_ALT_TEXT}
      className={cx(buttonStyles, className)}
      onClick={onClick}
      size={size}
      fill={palette.gray.light1}
      {...props}
    >
      <Icon size={size} glyph="X" />
    </IconButton>
  );
};

export default CloseButton;
