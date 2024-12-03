import React, { useContext, useEffect } from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { css } from '@leafygreen-ui/emotion';
import { HeaderContext } from '../../Header/header-context';
import { SNOOTY_REALM_APP_ID } from '../../../build-constants';
import { useSiteMetadata } from '../../../hooks/use-site-metadata';
import { theme } from '../../../theme/docsTheme';
import { isBrowser } from '../../../utils/is-browser';
import { normalizePath } from '../../../utils/normalize-path';
import { fetchBanner } from '../../../utils/realm';
import BrandingShape from './BrandingShape';

const getBannerSource = (src) => {
  if (src == null || src === '') return null;
  const srcUrl = `${SNOOTY_REALM_APP_ID}.mongodbstitch.com/${src}`;
  return `https://${normalizePath(srcUrl)}`;
};

const StyledBannerContainer = styled.a`
  display: block;
  height: ${theme.header.bannerHeight};
  width: 100%;
  position: absolute;
  z-index: ${theme.zIndexes.header};
  color: white;
  text-decoration: none;
`;

const StyledBannerContent = styled.div(
  (props) => `
    background-image: url(${getBannerSource(props.imgPath)});
    background-position: center;
    background-size: cover;
    background-color: ${props.bgColor};
    height: 100%;
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 0 11px;

    @media ${theme.screenSize.upToMedium} {
      background-image: url(${getBannerSource(props.tabletImgPath)});
    }

    @media ${theme.screenSize.upToSmall} {
      background-image: url(${getBannerSource(props.mobileImgPath)});
    }
  `
);

const bannerTextStyle = css`
  align-self: center;
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
  font-size: 12px;
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
  const { bannerContent, setBannerContent } = useContext(HeaderContext);
  const { snootyEnv } = useSiteMetadata();

  useEffect(() => {
    const fetchBannerContent = async () => {
      try {
        setBannerContent(await fetchBanner(snootyEnv));
        // TODO-5132: Remove and test with App Services when done
        const bannerContentMock = {
          text: 'Join us at AWS re:Invent 2024! Learn how to use MongoDB for AI use cases.',
          altText: 'Hello World!',
          pillText: 'LEARN MORE',
          bgColor: palette.green.dark3,
          url: 'https://www.mongodb.com/docs/',
        };
        setBannerContent(bannerContentMock);
      } catch (err) {
        console.error(err);
      }
    };
    if (isBrowser) {
      fetchBannerContent();
    }
  }, [setBannerContent, snootyEnv]);

  if (bannerContent == null) {
    return null;
  }

  return (
    <StyledBannerContainer href={bannerContent.url} title={bannerContent.altText}>
      <StyledBannerContent
        imgPath={bannerContent.imgPath}
        tabletImgPath={bannerContent.tabletImgPath ?? bannerContent.mobileImgPath}
        mobileImgPath={bannerContent.mobileImgPath}
        bgColor={bannerContent.bgColor}
      >
        {bannerContent.text && (
          <>
            <span className={bannerTextStyle}>{bannerContent.text}</span>
            <div className={pillContainer}>
              <div className={brandingContainer}>
                <BrandingShape size={'desktop'} />
              </div>
              {bannerContent.pillText && <span className={pillStyle}>{bannerContent.pillText}</span>}
            </div>
          </>
        )}
      </StyledBannerContent>
    </StyledBannerContainer>
  );
};

export default SiteBanner;
