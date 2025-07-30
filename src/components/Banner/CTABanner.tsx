import React, { useCallback } from 'react';
import { navigate } from 'gatsby';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import Icon, { glyphs } from '@leafygreen-ui/icon';
import ComponentFactory from '../ComponentFactory';
import { isRelativeUrl } from '../../utils/is-relative-url';
import type { CTABannerNode } from '../../types/ast';
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
  cursor: pointer;

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

interface CTABannerProps {
  nodeData: CTABannerNode;
}

const CTABanner = ({ nodeData: { children, options }, ...rest }: CTABannerProps) => {
  // Handles case sensitivity for specified icons
  let lgIcon = 'Play';
  if (options?.icon) {
    const standardizeCaseLGIcon = options.icon.charAt(0).toUpperCase() + options.icon.slice(1).toLowerCase();
    if (standardizeCaseLGIcon in glyphs) {
      lgIcon = standardizeCaseLGIcon;
    }
  }

  const onClick = useCallback(() => {
    if (!options?.url) return;
    isRelativeUrl(options?.url) ? navigate(options?.url) : (window.location.href = options?.url);
  }, [options?.url]);

  return (
    <div className={cx(videoBannerStyling)} onClick={onClick}>
      <div className={cx(lgIconStyling)}>
        <Icon glyph={lgIcon} fill={palette.blue.base} />
      </div>
      {children.map((child, i) => (
        <ComponentFactory {...rest} key={i} nodeData={child} />
      ))}
    </div>
  );
};

export default CTABanner;
