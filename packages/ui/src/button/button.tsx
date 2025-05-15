import React from 'react';

import LeafyButton, { type Size, type Variant } from '@leafygreen-ui/button';
import { cx, css } from '@leafygreen-ui/emotion';
import { BaseFontSize } from '@leafygreen-ui/tokens';
import { ButtonNode } from './types/ast';

type ButtonProps = {
  nodeData: ButtonNode;
  variant: Variant;
  darkMode: boolean;
  size: Size;
  baseFontSize: BaseFontSize;
  rightGlyph?: React.ReactElement;
  children?: React.ReactElement[];
};

type LinkProps = {
  as?: React.ElementType<any>;
  to?: string;
  href?: string;
};

// TODO: include mapping of colors to use against button 'variant' attributes
const buttonStyling = css`
  &.button {
    color: #ffffff;
  }
`;

const Button = ({
  nodeData: {
    options: { uri },
  },
  variant = 'primary',
  darkMode: darkModeProp,
  size = 'default',
  baseFontSize,
  rightGlyph,
  children,
  ...rest
}: ButtonProps) => {
  const linkProps: LinkProps = {};
  if (uri) {
    linkProps.as = 'a';
    linkProps.to = uri;
    linkProps.href = uri;
  }

  return (
    <LeafyButton
      className={cx(linkProps.as ? buttonStyling : '', 'button')}
      baseFontSize={baseFontSize}
      size={size}
      darkMode={darkModeProp}
      variant={variant}
      // rightGlyph={rightGlyph ? <Icon glyph={rightGlyph} /> : undefined}
      // {...componentProps}
      as={linkProps.as ? linkProps.as : undefined}
      href={linkProps.href ? linkProps.href : undefined}
    >
      {children}
    </LeafyButton>
  );
};

export default Button;
