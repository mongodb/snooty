import React from 'react';
import PropTypes from 'prop-types';
import LeafyButton from '@leafygreen-ui/button';
import ComponentFactory from './ComponentFactory';
import Link from './Link';
import { css, cx } from '@leafygreen-ui/emotion';

// TODO: include mapping of colors to use against button 'variant' attributes
const buttonStyling = css`
  color: #ffffff !important;
`;

const Button = ({
  nodeData: {
    argument,
    options: { uri },
  },
  ...rest
}) => {
  const componentProps = {};
  if (uri) {
    componentProps.as = Link;
    componentProps.to = uri;
  }

  return (
    <LeafyButton className={cx(uri ? buttonStyling : '', 'button')} variant="primary" {...componentProps}>
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
