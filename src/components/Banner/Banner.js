import React from 'react';
import PropTypes from 'prop-types';
import { palette } from '@leafygreen-ui/palette';
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

const styleMapLight = {
  info: {
    backgroundColor: palette.blue.light3,
    color: palette.blue.dark2,
    borderColor: palette.blue.light2,
    linkColor: palette.blue.dark3,
  },
  warning: {
    backgroundColor: palette.yellow.light3,
    color: palette.yellow.dark2,
    borderColor: palette.yellow.light2,
    linkColor: palette.yellow.dark3,
  },
  danger: {
    backgroundColor: palette.red.light3,
    color: palette.red.dark2,
    borderColor: palette.red.light2,
    linkColor: palette.red.dark3,
  },
  success: {
    backgroundColor: palette.green.light3,
    color: palette.green.dark2,
    borderColor: palette.green.light2,
    linkColor: palette.green.dark3,
  },
};
const styleMapDark = {
  info: {
    backgroundColor: palette.blue.dark3,
    color: palette.blue.light2,
    borderColor: palette.blue.dark2,
    linkColor: palette.blue.light3,
  },
  warning: {
    backgroundColor: palette.yellow.dark3,
    color: palette.yellow.light2,
    borderColor: palette.yellow.dark2,
    linkColor: palette.yellow.light3,
  },
  danger: {
    backgroundColor: palette.red.dark3,
    color: palette.red.light2,
    borderColor: palette.red.dark2,
    linkColor: palette.red.light3,
  },
  success: {
    backgroundColor: palette.green.dark3,
    color: palette.green.light2,
    borderColor: palette.green.dark2,
    linkColor: palette.green.light3,
  },
};

const StyledBanner = styled((props) => <LeafyBanner {...props} />)`
  ${baseBannerStyle}
  background-color: ${(props) => styleMapLight[props.variant].backgroundColor};
  color: ${(props) => styleMapLight[props.variant].color};
  border-color: ${(props) => styleMapLight[props.variant].borderColor};
  a {
    color: ${(props) => styleMapLight[props.variant].linkColor};
    :hover {
      ${(props) => styleMapLight[props.variant].color};
    }
  }

  .dark-theme & {
    background-color: ${(props) => styleMapDark[props.variant].backgroundColor};
    color: ${(props) => styleMapDark[props.variant].color};
    border-color: ${(props) => styleMapDark[props.variant].borderColor};
    a {
      color: ${(props) => styleMapDark[props.variant].linkColor};
      :hover {
        ${(props) => styleMapDark[props.variant].color};
      }
    }
  }
`;

const Banner = ({ nodeData: { children, options }, ...rest }) => {
  return (
    <StyledBanner variant={alertMap[options?.variant] || LeafyVariant.Info}>
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
