import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import LeafyBanner, { Variant as LeafyVariant } from '@leafygreen-ui/banner';
import ComponentFactory from './index';

export const alertMap = {
  info: LeafyVariant.Info,
  warning: LeafyVariant.Warning,
  danger: LeafyVariant.Danger,
  success: LeafyVariant.Success,
};

const StyledBanner = styled((props) => <LeafyBanner {...props} />)`
  /* Add margins below all child elements in the banner */
  & > div > div > * {
    margin: 0 0 12px;
  }

  & > div > div > *:last-child {
    margin: 0;
  }

  /* Remove margins on individual paragraphs */
  p {
    margin: 0;
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
