import React, { useContext, useEffect } from 'react';
import styled from '@emotion/styled';
import { HeaderContext } from './header-context';
import { SNOOTY_STITCH_ID } from '../build-constants';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { theme } from '../theme/docsTheme';
import { isBrowser } from '../utils/is-browser';
import { normalizePath } from '../utils/normalize-path';
import { fetchBanner } from '../utils/realm';

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

const SiteBanner = () => {
  const { bannerContent, setBannerContent } = useContext(HeaderContext);
  const { snootyEnv } = useSiteMetadata();

  useEffect(() => {
    const fetchBannerContent = async () => {
      try {
        setBannerContent(await fetchBanner(snootyEnv));
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
      <StyledBannerContent imgPath={bannerContent.imgPath} mobileImgPath={bannerContent.mobileImgPath} />
    </StyledBannerContainer>
  );
};

export default SiteBanner;
