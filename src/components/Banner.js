import React, { useContext, useEffect } from 'react';
import { AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import { css } from '@emotion/core';
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

const Banner = ({ ...props }) => {
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
    <a
      css={css`
        display: block;
        height: ${theme.header.bannerHeight};
        width: 100vw;
      `}
      href={bannerContent.url}
      title={bannerContent.altText}
      {...props}
    >
      <div
        css={css`
          background-image: url(${getBannerSource(bannerContent.imgPath)});
          background-position: center;
          background-size: cover;
          height: 100%;

          @media ${theme.screenSize.upToMedium} {
            background-image: url(${getBannerSource(bannerContent.mobileImgPath)});
          }
        `}
      />
    </a>
  );
};

export default Banner;
