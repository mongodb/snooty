const { siteMetadata } = require('../../src/utils/site-metadata');

const fetchBanner = async () => {
  const isStaging = ['staging', 'development', 'dotcomstg'].includes(siteMetadata.snootyEnv);
  try {
    const res = await fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/banners/${isStaging ? '?staging=true' : ''}`);
    return await res.json();
  } catch (e) {
    console.error(`Error while fetching banner data from Nextjs: ${e}`);
    return null;
  }
};

const createBannerNode = async ({ createNode, createNodeId, createContentDigest }) => {
  const banner = await fetchBanner();

  createNode({
    children: [],
    id: createNodeId(`banner-content`),
    internal: {
      contentDigest: createContentDigest(banner),
      type: 'BannerContent',
    },
    isEnabled: banner?.isEnabled ?? false,
    altText: banner?.altText ?? '',
    imgPath: banner?.imgPath,
    tabletImgPath: banner?.tabletImgPath,
    mobileImgPath: banner?.mobileImgPath,
    bgColor: banner?.bgColor,
    text: banner?.text,
    pillText: banner?.pillText,
    url: banner?.url ?? '',
  });
};

module.exports = {
  createBannerNode,
  fetchBanner,
};
