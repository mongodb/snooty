import React, { useState, useEffect } from 'react';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import { css } from '@emotion/core';
import { SNOOTY_STITCH_ID } from '../build-constants';
import { theme } from '../theme/docsTheme';
import { normalizePath } from '../utils/normalize-path';

const getBannerSource = src => {
  const hostUrl = `${SNOOTY_STITCH_ID}.mongodbstitch.com/`;
  return src ? 'https://' + normalizePath(hostUrl + src) : null;
};

const fetchBannerContent = async setBannerContent => {
  const client = Stitch.hasAppClient(SNOOTY_STITCH_ID)
    ? Stitch.getAppClient(SNOOTY_STITCH_ID)
    : Stitch.initializeAppClient(SNOOTY_STITCH_ID);
  await client.auth.loginWithCredential(new AnonymousCredential()).catch(console.error);
  const bannerContent = await client.callFunction('getBanner');
  setBannerContent(bannerContent);
};

const Banner = () => {
  const [bannerContent, setBannerContent] = useState(null);

  useEffect(() => {
    fetchBannerContent(setBannerContent);
  }, []);

  if (bannerContent == null) {
    return null;
  }

  return (
    <a
      css={css`
        display: block;
        height: 40px;
        width: 100vw;
      `}
      href={bannerContent?.url}
      title={bannerContent?.altText}
    >
      <div
        css={css`
          background-image: url(${getBannerSource(bannerContent?.imgPath)});
          background-position: center;
          background-size: cover;
          height: 100%;

          @media ${theme.screenSize.upToMedium} {
            background-image: url(${getBannerSource(bannerContent?.mobileImgPath)});
          }
        `}
      />
    </a>
  );
};

export default Banner;
