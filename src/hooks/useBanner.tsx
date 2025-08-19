import { useStaticQuery, graphql } from 'gatsby';

type BannerResult = {
  bannerContent: {
    isEnabled: boolean;
    altText: string;
    imgPath?: string;
    tabletImgPath?: string;
    mobileImgPath?: string;
    bgColor?: string;
    text?: string;
    pillText?: string;
    url: string;
  };
};

// Return an array of MongoDB products
export const useBanner = () => {
  const { bannerContent } = useStaticQuery<BannerResult>(
    graphql`
      query BannerContent {
        bannerContent {
          isEnabled
          altText
          imgPath
          tabletImgPath
          mobileImgPath
          bgColor
          text
          pillText
          url
        }
      }
    `
  );
  return bannerContent;
};
