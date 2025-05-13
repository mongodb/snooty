import React from 'react';
import { BaseFontSize } from '@leafygreen-ui/tokens';
import LeafyButton from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { Directive } from '../types/ast';
import ComponentFactory from './ComponentFactory';
import Link, { LinkProps } from './Link';

// TODO: include mapping of colors to use against button 'variant' attributes
const buttonStyling = css`
  &.button {
    color: #ffffff;
  }
`;

export type ButtonProps = {
  nodeData: Directive<{ uri?: string }>;
  variant?: 'primary';
  darkMode: boolean;
  baseFontSize: BaseFontSize;
  rightGlyph: string;
  size: 'default';
};

export type ComponentProps = {
  as?: React.ComponentType<LinkProps>;
  to?: string;
  href?: string;
};

const Button = ({
  nodeData: {
    argument,
    options: { uri },
  },
  variant = 'primary',
  darkMode: darkModeProp,
  size = 'default',
  baseFontSize,
  rightGlyph,
  ...rest
}: ButtonProps) => {
  const { darkMode } = useDarkMode();
  const componentProps: ComponentProps = {};
  if (uri) {
    componentProps.as = Link;
    componentProps.to = uri;
    componentProps.href = uri;
  }

  return (
    <LeafyButton
      className={cx(componentProps.as ? buttonStyling : '', 'button')}
      baseFontSize={baseFontSize}
      size={size}
      darkMode={darkModeProp ?? darkMode}
      variant={variant}
      rightGlyph={rightGlyph ? <Icon glyph={rightGlyph} /> : null}
      {...componentProps}
    >
      {argument.map((child, i) => (
        <ComponentFactory {...rest} nodeData={child} key={i} />
      ))}
    </LeafyButton>
  );
};

export default Button;
