/**
 * Returns `true` if the build is a preview build for Gatsby Cloud.
 */
const isGatsbyPreview = () => process.env.GATSBY_IS_PREVIEW === 'true';

module.exports = { isGatsbyPreview };
