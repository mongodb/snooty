import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { Banner as LeafyBanner, Variant as LeafyVariant } from '@leafygreen-ui/banner';

export const alertMap = {
  info: LeafyVariant.Info,
  warning: LeafyVariant.Warning,
  danger: LeafyVariant.Danger,
  success: LeafyVariant.Success,
};

const Banner = ({ nodeData: { children, variant }, ...rest }) => {
  return (
    <LeafyBanner variant={alertMap[variant] || LeafyVariant.Info}>
      {children.map((child, i) => (
        <ComponentFactory {...rest} key={i} nodeData={child} />
      ))}
    </LeafyBanner>
  );
};

Banner.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired,
  }).isRequired,
};

export default Banner;
