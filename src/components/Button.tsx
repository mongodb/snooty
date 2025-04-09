import React from 'react';
import LeafyButton from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { Directive } from '../types/ast';
import ComponentFactory from './ComponentFactory';
import Link from './Link';

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
  baseFontSize: string;
  rightGlyph: React.ReactNode;
  size: 'default';
};

const Button = ({
  nodeData: { argument, options },
  variant = 'primary',
  darkMode: darkModeProp,
  size = 'default',
  baseFontSize,
  rightGlyph,
  ...rest
}: ButtonProps) => {
  const { uri } = options ?? { uri: undefined };
  const { darkMode } = useDarkMode();
  const componentProps = {};
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
