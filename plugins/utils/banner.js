const { siteMetadata } = require('../../src/utils/site-metadata');

const createBannerNode = async ({ db, createNode, createNodeId, createContentDigest }) => {
  const banner = await db.realmInterface.fetchBanner(siteMetadata.snootyEnv === 'development');

  createNode({
    children: [],
    id: createNodeId(`banner-content`),
    internal: {
      contentDigest: createContentDigest(banner),
      type: 'BannerContent',
    },
    isEnabled: banner.isEnabled ?? false,
    altText: banner.altText ?? '',
    imgPath: banner.imgPath,
    tabletImgPath: banner.tabletImgPath,
    mobileImgPath: banner.mobileImgPath,
    bgColor: banner.bgColor,
    text: banner.text,
    pillText: banner.pillText,
    url: banner.url ?? '',
  });
};

module.exports = {
  createBannerNode,
};
