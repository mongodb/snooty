// env variables for building site along with use in front-end
// https://www.gatsbyjs.org/docs/environment-variables/#defining-environment-variables
const validateEnvVariables = () => {
  // make sure necessary env vars exist
  if (
    !process.env.GATSBY_MANIFEST_PATH ||
    !process.env.GATSBY_SITE ||
    !process.env.GATSBY_PARSER_USER ||
    !process.env.GATSBY_PARSER_BRANCH
  ) {
    return {
      error: true,
      message: `${process.env.NODE_ENV} requires the variables GATSBY_MANIFEST_PATH, GATSBY_SITE, GATSBY_PARSER_USER, and GATSBY_PARSER_BRANCH`,
    };
  }
  // create split prefix for use in stitch function
  return {
    error: false,
  };
};

module.exports.validateEnvVariables = validateEnvVariables;
