const { constructPageIdPrefix } = require('./construct-page-id-prefix');
const { constructPercyPageIdQuery } = require('./percy-utils');

// Returns the query to be used by our Stitch/Realm function to fetch a site's documents
const constructBuildFilter = ({ commitHash, patchId, ...rest }) => {
  const pageIdPrefix = constructPageIdPrefix(rest);
  return {
    page_id: pageIdQuery(pageIdPrefix),
    commit_hash: commitHash || { $exists: false },
    patch_id: patchId || { $exists: false },
  };
};

// Determines whether to use a standard query, or multi-property query for Percy snapshots
const pageIdQuery = (pageIdPrefix) => {
  return !!process.env.PERCY_BUILD ? constructPercyPageIdQuery() : { $regex: new RegExp(`^${pageIdPrefix}(/|$)`) };
};

module.exports = { constructBuildFilter };
