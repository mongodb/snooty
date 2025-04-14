// Concatenates a site prefix to return a page id
export const constructPageIdPrefix = ({ project, parserUser, parserBranch }) =>
  `${project}/${parserUser}/${parserBranch}`;
