import React from 'react';
import { palette } from '@leafygreen-ui/palette';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../../../theme/docsTheme';
import { useBanner } from '../../../hooks/useBanner';
import { SiteBannerContent } from './types';
import BrandingShape from './BrandingShape';

const bannerContainerStyle = css`
  display: block;
  height: ${theme.header.bannerHeight};
  width: 100%;
  position: absolute;
  z-index: ${theme.zIndexes.header};
  color: white;
  text-decoration: none;
`;

const bannerContentStyle = (bannerContent: Partial<SiteBannerContent>) => css`
  background-image: url(${bannerContent.imgPath});
  background-position: center;
  background-size: cover;
  ${bannerContent.bgColor && `background-color: ${bannerContent.bgColor};`}
  height: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 0 11px;
  font-size: ${theme.fontSize.small};
  line-height: 20px;

  @media ${theme.screenSize.upToMedium} {
    background-image: url(${bannerContent.tabletImgPath});
    justify-content: space-between;
  }

  @media ${theme.screenSize.upToSmall} {
    background-image: url(${bannerContent.mobileImgPath});
    font-size: ${theme.fontSize.xsmall};
  }
`;

const bannerTextStyle = css`
  align-self: center;
  max-height: 40px;
`;

const pillContainer = css`
  display: grid;
  justify-items: center;
  align-items: center;
`;

// Forces components to be in the same cell to create an overlap
const gridCell = css`
  grid-row: 1;
  grid-column: 1;
`;

const brandingContainer = css`
  ${gridCell}
  height: 40px;
`;

const pillStyle = css`
  ${gridCell}
  color: ${palette.green.dark3};
  font-weight: 600;
  line-height: 16px;
  font-size: ${theme.fontSize.tiny};
  background-color: ${palette.green.base};
  border: 1px solid ${palette.green.dark2};
  border-radius: 6px;
  height: 22px;
  padding: 3px 8px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SiteBanner = () => {
  const bannerContent = useBanner();

  if (!(bannerContent && bannerContent.url && (bannerContent.imgPath || bannerContent.text))) {
    return null;
  }

  // Ensure Smartling doesn't translate the banner or rewrite anything
  const smartlingClassNames = 'sl_opaque notranslate';
  // Backup class name in case Smartling needs to target the whole element
  const bannerClassName = 'site-banner';

  return (
    <a
      className={cx(bannerClassName, smartlingClassNames, bannerContainerStyle)}
      href={bannerContent.url}
      title={bannerContent.altText}
    >
      <div
        className={bannerContentStyle({
          imgPath: bannerContent.imgPath,
          tabletImgPath: bannerContent.tabletImgPath ?? bannerContent.mobileImgPath,
          mobileImgPath: bannerContent.mobileImgPath,
          bgColor: bannerContent.bgColor,
        })}
      >
        {bannerContent.text && (
          <>
            <span className={cx(smartlingClassNames, bannerTextStyle)}>{bannerContent.text}</span>
            <div className={pillContainer}>
              <div className={brandingContainer}>
                <BrandingShape />
              </div>
              {bannerContent.pillText && (
                <span className={cx(smartlingClassNames, pillStyle)}>{bannerContent.pillText}</span>
              )}
            </div>
          </>
        )}
      </div>
    </a>
  );
};

export default SiteBanner;
