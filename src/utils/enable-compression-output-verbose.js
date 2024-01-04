/**
 * Returns `true` if the GATSBY_COMPRESSION_VERBOSE env is set to true.
 */
const GATSBY_COMPRESSION_VERBOSE = process.env.GATSBY_COMPRESSION_VERBOSE;
const enableZopfliCompressOutputVerbose = () =>
  typeof GATSBY_COMPRESSION_VERBOSE === 'string' ? GATSBY_COMPRESSION_VERBOSE.toLowerCase() === 'true' : false;

module.exports = { enableZopfliCompressOutputVerbose };
