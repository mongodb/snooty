import React from 'react';
import PropTypes from 'prop-types';
import LeafyButton from '@leafygreen-ui/button';
import { css, cx } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import ComponentFactory from './ComponentFactory';
import Link from './Link';

// TODO: include mapping of colors to use against button 'variant' attributes
const buttonStyling = css`
  &.button {
    color: #ffffff;
  }
`;

const Button = ({
  nodeData: {
    argument,
    options: { uri },
  },
  variant = 'primary',
  darkMode,
  size = 'default',
  baseFontSize,
  rightGlyph,
  ...rest
}) => {
  const componentProps = {};
  if (uri) {
    componentProps.as = Link;
    componentProps.to = uri;
  }

  return (
    <LeafyButton
      className={cx(componentProps.as ? buttonStyling : '', 'button')}
      baseFontSize={baseFontSize}
      size={size}
      darkMode={darkMode}
      variant={variant}
      rightGlyph={<Icon glyph={rightGlyph} />}
      {...componentProps}
    >
      {argument.map((child, i) => (
        <ComponentFactory {...rest} nodeData={child} key={i} />
      ))}
    </LeafyButton>
  );
};

Button.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Button;
