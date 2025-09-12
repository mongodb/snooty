const { siteMetadata } = require('../../src/utils/site-metadata');

const createBannerNode = async ({ createNode, createNodeId, createContentDigest }) => {
  const isStaging = ['staging', 'development', 'dotcomstg'].includes(siteMetadata.snootyEnv);
  const res = await fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/banners/${isStaging ? '?staging=true' : ''}`);
  const banner = await res.json();

  createNode({
    children: [],
    id: createNodeId(`banner-content`),
    internal: {
      contentDigest: createContentDigest(banner),
      type: 'BannerContent',
    },
    isEnabled: banner.isEnabled,
    altText: banner.altText,
    imgPath: banner.imgPath,
    tabletImgPath: banner.tabletImgPath,
    mobileImgPath: banner.mobileImgPath,
    bgColor: banner.bgColor,
    text: banner.text,
    pillText: banner.pillText,
    url: banner.url,
  });
};

module.exports = {
  createBannerNode,
};
