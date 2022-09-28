// Returns the filter to use when querying for a site's versions/branches.
const constructReposFilter = (project, useRepoName) => {
  const filter = { project };

  // Handles case where public and internal docs share the same project name.
  // REPO_NAME should be passed in by the autobuilder as an env variable
  if (process.env.REPO_NAME && useRepoName) {
    filter['repoName'] = process.env.REPO_NAME;
  }

  return filter;
};

module.exports = { constructReposFilter };
