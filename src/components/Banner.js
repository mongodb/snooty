import React, { useContext, useEffect } from 'react';
import { AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import styled from '@emotion/styled';
import { HeaderContext } from './header-context';
import { SNOOTY_STITCH_ID } from '../build-constants';
import { theme } from '../theme/docsTheme';
import { normalizePath } from '../utils/normalize-path';
import { getStitchClient } from '../utils/stitch';

const getBannerSource = (src) => {
  if (src == null || src === '') return null;
  const srcUrl = `${SNOOTY_STITCH_ID}.mongodbstitch.com/${src}`;
  return `https://${normalizePath(srcUrl)}`;
};

const StyledBannerContainer = styled.a`
  display: block;
  height: ${theme.header.bannerHeight};
  width: 100vw;
`;

const StyledBannerContent = styled.div(
  (props) => `
    background-image: url(${getBannerSource(props.imgPath)});
    background-position: center;
    background-size: cover;
    height: 100%;

    @media ${theme.screenSize.upToMedium} {
      background-image: url(${getBannerSource(props.mobileImgPath)});
    }
  `
);

const Banner = () => {
  const { bannerContent, setBannerContent } = useContext(HeaderContext);

  useEffect(() => {
    const fetchBannerContent = async () => {
      const client = getStitchClient(SNOOTY_STITCH_ID);
      await client.auth.loginWithCredential(new AnonymousCredential()).catch(console.error);
      const banner = await client.callFunction('getBanner');
      setBannerContent(banner);
    };
    fetchBannerContent();
  }, [setBannerContent]);

  if (bannerContent == null) {
    return null;
  }

  return (
    <StyledBannerContainer href={bannerContent.url} title={bannerContent.altText}>
      <StyledBannerContent imgPath={bannerContent.imgPath} mobileImgPath={bannerContent.mobileImgPath} />
    </StyledBannerContainer>
  );
};

export default Banner;
