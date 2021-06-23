import React from 'react';
import PropTypes from 'prop-types';
import LeafyButton from '@leafygreen-ui/button';
import ComponentFactory from './ComponentFactory';
import Link from './Link';

const Button = ({
  nodeData: {
    argument,
    options: { uri },
  },
  ...rest
}) => {
  return (
    <LeafyButton className="button" as={Link} variant="primary" to={uri}>
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
