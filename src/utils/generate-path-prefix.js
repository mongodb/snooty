export const generatePathPrefix = ({ parserBranch, project, snootyBranch, user }) => {
  const prefix = `${project}/${user}/${parserBranch}`;
  return process.env.GATSBY_SNOOTY_DEV ? `/${snootyBranch}/${prefix}` : `/${prefix}`;
};
