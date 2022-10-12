import { useSiteMetadata } from './use-site-metadata';
import { useMemo } from 'react';

export const setOptionSlug = (branch) => {
  return branch['urlSlug'] || branch['gitBranchName'];
};

export const useUrlSlug = (branches = []) => {
  const { parserBranch } = useSiteMetadata();
  const currentUrlSlug = useMemo(() => {
    for (let branch of branches) {
      if (branch.gitBranchName === parserBranch) {
        return setOptionSlug(branch);
      }
    }
    return parserBranch;
  }, [branches, parserBranch]);

  return { currentUrlSlug };
};
