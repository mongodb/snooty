import React from 'react';
import PropTypes from 'prop-types';
import { Button as UIButton } from '@snooty/ui/';
import Icon from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import ComponentFactory from './ComponentFactory';

const Button = ({
  nodeData,
  variant = 'primary',
  darkMode: darkModeProp,
  size = 'default',
  baseFontSize,
  rightGlyph,
  ...rest
}) => {
  // this is the only part that is declared outside of button
  const { darkMode } = useDarkMode();

  return (
    <UIButton
      nodeData={nodeData}
      variant={variant}
      darkMode={darkMode ?? darkModeProp}
      size={size}
      baseFontSize={baseFontSize}
      rightGlyph={undefined}
    >
      {nodeData.argument.map((child, i) => (
        <ComponentFactory {...rest} nodeData={child} key={i} />
      ))}
    </UIButton>
  );
};

Button.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Button;
