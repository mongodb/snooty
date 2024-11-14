import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import Icon, { glyphs } from '@leafygreen-ui/icon';
import ComponentFactory from '../ComponentFactory';
import { baseBannerStyle } from './styles/bannerItemStyle';

const videoBannerStyling = css`
  ${baseBannerStyle};
  background-color: ${palette.blue.light3};
  border: 1px solid ${palette.blue.light2};
  color: ${palette.blue.dark2};
  .dark-theme & {
    background-color: ${palette.blue.dark3};
    border: 1px solid ${palette.blue.dark2};
    color: ${palette.blue.light2};
  }
  align-items: center;

  border-radius: 6px;

  display: flex;
  font-size: 14px;
  margin: 24px 0px;
  min-height: 44px;
  padding: 9px 12px 9px 20px;
  position: relative;

  > p {
    margin-left: 15px;
  }
`;

const lgIconStyling = css`
  width: 26px;
  min-width: 26px;
  height: 26px;
  background-color: ${palette.blue.light2};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${palette.blue.base};
  border-radius: 20px;
  margin-left: -5px;
`;

const linkStyling = css`
  text-decoration: none !important;
  color: unset;
`;

const CTABanner = ({ nodeData: { children, options }, ...rest }) => {
  // Handles case sensitivity for specified icons
  let lgIcon = 'Play';
  if (options?.icon) {
    const standardizeCaseLGIcon = options.icon.charAt(0).toUpperCase() + options.icon.slice(1).toLowerCase();
    if (standardizeCaseLGIcon in glyphs) {
      lgIcon = standardizeCaseLGIcon;
    }
  }

  return (
    <a href={options?.url} className={cx(linkStyling)}>
      <div className={cx(videoBannerStyling)}>
        <div className={cx(lgIconStyling)}>
          <Icon glyph={lgIcon} fill={palette.blue.base} />
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
      icon: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default CTABanner;
