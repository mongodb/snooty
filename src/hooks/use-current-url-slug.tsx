import { useMemo } from 'react';
import { BranchData } from '../types/data';

export const getBranchSlug = (branch: BranchData) => {
  return branch['urlSlug'] || branch['gitBranchName'];
};

export const useCurrentUrlSlug = (parserBranch: string, branches: BranchData[]): string | undefined => {
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
