/**
 *  If we're in preview mode, we build the pages of each project and branch of the site within
 * its own namespace so each author can preview their own pages e.g.
 * /project1/branch1/doc-path
 * /project2/branch2/doc-path
 *
 * So to navigate with the namespaced site, we add to each link the current project and branch
 * the user is browsing in.
 */
const getGatsbyPreviewLink = (to, location) => {
  const projectAndBranchPrefix = `/` + location.pathname.split(`/`).slice(1, 3).join(`/`);
  if (!to.startsWith(projectAndBranchPrefix)) {
    to = projectAndBranchPrefix + to;
  }
  return to;
};

module.exports = { getGatsbyPreviewLink };
