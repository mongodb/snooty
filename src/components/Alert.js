import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import Banner, { Variant } from '@leafygreen-ui/banner';

export const alertMap = {
  info: Variant.Info,
  warning: Variant.Warning,
  danger: Variant.Danger,
  success: Variant.Success,
};

const Alert = ({ nodeData: { children, name }, ...rest }) => {
  return (
    <Banner variant={alertMap[name] || Variant.Info}>
      {children.map((child, i) => (
        <ComponentFactory {...rest} key={i} nodeData={child} />
      ))}
    </Banner>
  );
};

Alert.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Alert;
