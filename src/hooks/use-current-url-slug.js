import { useMemo } from 'react';

export const getBranchSlug = (branch) => {
  return branch['urlSlug'] || branch['gitBranchName'];
};

// whats going to happen to this, do i have to replicate it.
export const useCurrentUrlSlug = (parserBranch, branches) => {
  const currentUrlSlug = useMemo(() => {
    if (!branches || !branches.length) {
      return;
    }
    for (let branch of branches) {
      if (branch.gitBranchName === parserBranch) {
        return getBranchSlug(branch);
      }
    }
    return parserBranch;
  }, [branches, parserBranch]);

  return currentUrlSlug;
};
