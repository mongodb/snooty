// Concatenates a site prefix to return a page id
const constructPageIdPrefix = ({ project, parserUser, parserBranch }) => `${project}/${parserUser}/${parserBranch}`;

module.exports = { constructPageIdPrefix };
