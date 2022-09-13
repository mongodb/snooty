import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';
import { useSiteMetadata } from '../hooks/use-site-metadata';

// begin helper functions
const STORAGE_KEY = 'activeVersions';

function getInitBranchName(branches) {
  const activeBranch = branches.find((b) => b.active);
  if (activeBranch) {
    return activeBranch.name || activeBranch.gitBranchName;
  }
  return branches[0]?.name || null;
}

const versionStateReducer = (state, { project, versionName }) => {
  return {
    ...state,
    [project]: versionName,
  };
};

// return initial active versions of documents if not found in local storage
function getInitVersions(metadata, repoBranches, associatedReposInfo) {
  const initState = {};
  // set version state of current project
  initState[`${metadata.project}`] = getInitBranchName(repoBranches.branches);
  // for each associated product, set version state
  for (const productName in associatedReposInfo) {
    initState[productName] = getInitBranchName(associatedReposInfo[productName]?.branches || []);
  }
  return initState;
}
// end helper functions

const VersionContext = createContext({
  activeVersions: {},
  // active version for each product is marked is {[product name]: active version} pair
  setActiveVersions: () => {},
  availableVersions: {},
});

const VersionContextProvider = ({ repoBranches, associatedReposInfo, children }) => {
  const metadata = useSiteMetadata();
  // expose the available versions for current and associated products
  const availableVersions = useMemo(async () => {
    try {
      // TODO: call client side fn to realm app services to get repo branches
      throw new Error('test err');
    } catch (e) {
      console.error(e);
      const versions = {};
      versions[metadata.project] = repoBranches?.branches || [];
      for (const productName in associatedReposInfo) {
        versions[productName] = associatedReposInfo[productName]?.repoInfo?.branches || [];
      }
      return versions;
    }
    // does not need to refetch after initial fetch
    // also falls back to server side fetch for branches
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // tracks active versions across app
  const [activeVersions, setActiveVersions] = useReducer(
    versionStateReducer,
    getLocalValue(STORAGE_KEY) || getInitVersions(metadata, repoBranches, associatedReposInfo)
  );
  // update local storage when active versions change
  useEffect(() => {
    setLocalValue(STORAGE_KEY, activeVersions);
  }, [activeVersions]);

  return (
    <VersionContext.Provider value={{ activeVersions, setActiveVersions, availableVersions }}>
      {children}
    </VersionContext.Provider>
  );
};

export { VersionContext, VersionContextProvider };
