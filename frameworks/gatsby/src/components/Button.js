import React from 'react';
import PropTypes from 'prop-types';
import LeafyButton from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { css, cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
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
  darkMode: darkModeProp,
  size = 'default',
  baseFontSize,
  rightGlyph,
  ...rest
}) => {
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

Button.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Button;
