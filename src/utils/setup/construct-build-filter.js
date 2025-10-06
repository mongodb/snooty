const { constructPageIdPrefix } = require('./construct-page-id-prefix');

// Returns the query to be used by our Next API to fetch a site's documents
const constructBuildFilter = ({ commitHash, patchId, ...rest }) => {
  const pageIdPrefix = constructPageIdPrefix(rest);
  return {
    page_id: { $regex: new RegExp(`^${pageIdPrefix}(/|$)`) },
    commit_hash: commitHash || { $exists: false },
    patch_id: patchId || { $exists: false },
  };
};

module.exports = { constructBuildFilter };
