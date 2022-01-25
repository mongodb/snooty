import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { cx, css as LeafyCSS } from '@leafygreen-ui/emotion';
import LeafyBanner, { Variant as LeafyVariant } from '@leafygreen-ui/banner';
import { uiColors } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import ComponentFactory from '../ComponentFactory';
import { baseBannerStyle } from './styles/bannerItemStyle';

const StyledBanner = styled((props) => <LeafyBanner {...props} />)`
  ${baseBannerStyle}
  border-left-color: ${uiColors.blue.light2};
`;

const videoBannerStyling = LeafyCSS`
  border-left-width: 1px;

  svg {
    height: 15px;
    margin-left: 3px;
    margin-bottom: -5px;
  }

  &:before {
    background-color: transparent;
  }
`;

const playIconStyling = css`
  border: 1px solid #007cad;
  border-radius: 20px;
  border-width: 1px;
  margin-left: -5px;
  width: 25px;
  height: 25px;
  background-color: ${uiColors.blue.light2};
  margin-top: 0px;
  margin-bottom: 0px;
`;

const CTABanner = ({ nodeData: { children, options }, ...rest }) => {
  return (
    <>
      <a href={options.url}>
        <StyledBanner
          className={cx(videoBannerStyling)}
          variant={LeafyVariant.Info}
          image={
            <div css={playIconStyling}>
              <Icon glyph="Play" fill="#007CAD" />
            </div>
          }
        >
          {children.map((child, i) => (
            <ComponentFactory {...rest} key={i} nodeData={child} />
          ))}
        </StyledBanner>
      </a>
    </>
  );
};

CTABanner.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CTABanner;
