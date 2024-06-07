import React from 'react';
import PropTypes from 'prop-types';
import { palette } from '@leafygreen-ui/palette';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import styled from '@emotion/styled';
import LeafyBanner, { Variant as LeafyVariant } from '@leafygreen-ui/banner';
import ComponentFactory from '../ComponentFactory';
import { baseBannerStyle } from './styles/bannerItemStyle';

export const alertMap = {
  info: LeafyVariant.Info,
  warning: LeafyVariant.Warning,
  danger: LeafyVariant.Danger,
  success: LeafyVariant.Success,
};

const StyledBanner = styled((props) => <LeafyBanner {...props} />)`
  ${baseBannerStyle}
`;

const Banner = ({ nodeData: { children, options }, ...rest }) => {
  const { darkMode } = useDarkMode();
  return (
    <StyledBanner
      variant={alertMap[options?.variant] || LeafyVariant.Info}
      style={{ '--text-decoration-color': darkMode ? palette.blue.light2 : palette.blue.dark2 }}
    >
      {children.map((child, i) => (
        <ComponentFactory {...rest} key={i} nodeData={child} />
      ))}
    </StyledBanner>
  );
};

Banner.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    variant: PropTypes.string.isRequired,
  }).isRequired,
};

export default Banner;
