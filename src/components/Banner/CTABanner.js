import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { uiColors } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import ComponentFactory from '../ComponentFactory';
import { baseBannerStyle } from './styles/bannerItemStyle';

const videoBannerStyling = css`
  ${baseBannerStyle};
  background-color: ${uiColors.blue.light3};
  border: 1px solid ${uiColors.blue.light2};
  border-radius: 6px;
  display: flex;
  position: relative;
  font-size: 14px;
  padding: 9px 12px 9px 20px;
  color: ${uiColors.blue.dark2};

  > p {
    margin-left: 35px;
  }

  svg {
    height: 15px;
    margin-left: 3px;
    margin-bottom: -3px;
  }
`;

const playIconStyling = css`
  border: 1px solid ${uiColors.blue.base};
  border-radius: 20px;
  width: 25px;
  height: 25px;
  background-color: ${uiColors.blue.light2};
  margin-left: -5px;
  position: absolute;
`;

const CTABanner = ({ nodeData: { children, options }, ...rest }) => {
  return (
    <a href={options?.url}>
      <div css={videoBannerStyling}>
        <div css={playIconStyling}>
          <Icon glyph="Play" fill={uiColors.blue.base} />
        </div>
        {children.map((child, i) => (
          <ComponentFactory {...rest} key={i} nodeData={child} />
        ))}
      </div>
    </a>
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
