import React from 'react';
import { cx, css } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import IconButton, { Size } from '@leafygreen-ui/icon-button';
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

const CloseButton = ({
  onClick,
  size = Size.Default,
  className,
  ...props
}: {
  onClick: () => void;
  size?: Size;
  className?: string;
}) => {
  return (
    <IconButton
      aria-label={CLOSE_BUTTON_ALT_TEXT}
      className={cx(buttonStyles, className)}
      onClick={onClick}
      size={size}
      {...props}
    >
      <Icon size={size} glyph="X" />
    </IconButton>
  );
};

export default CloseButton;
