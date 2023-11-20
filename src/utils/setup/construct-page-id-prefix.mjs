// Concatenates a site prefix to return a page id
const constructPageIdPrefix = ({ project, parserUser, parserBranch }) => `${project}/${parserUser}/${parserBranch}`;

export default constructPageIdPrefix;
