import React, { createContext, useReducer, useEffect, useState } from 'react';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';
import { useSiteMetadata } from '../hooks/use-site-metadata';

// begin helper functions
const STORAGE_KEY = 'activeVersions';

function getInitBranchName(branches) {
  const activeBranch = branches.find((b) => b.isStableBranch);
  if (activeBranch) {
    return activeBranch.name || activeBranch.gitBranchName;
  }
  return branches[0]?.name || null;
}

function getInitVersions(branchListByProduct) {
  const initState = {};
  for (const productName in branchListByProduct) {
    initState[productName] = getInitBranchName(branchListByProduct[productName]);
  }
  console.log('check initState');
  console.log(initState);
  return initState;
}

// version state reducer helper fn
// overwrite current state with any new state attributes
const versionStateReducer = (state, newState) => {
  return {
    ...state,
    ...newState,
  };
};
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
  // TODO: usememo not correct here. useEffect for async call
  const [availableVersions, setAvailableVersions] = useState({});
  // on init, fetch versions from realm app services
  useEffect(() => {
    const getVersions = async () => {
      // TODO: call client side stitch fn, that calls realm app services to get repo branches
      // same code block as error, but with calls to stitch
      throw new Error('test err');
    };

    getVersions().catch((e) => {
      // on error of realm function, fall back to build time fetches
      const versions = {};
      versions[metadata.project] = repoBranches?.branches || [];
      for (const productName in associatedReposInfo) {
        versions[productName] = associatedReposInfo[productName].branches || [];
      }
      if (!activeVersions || !activeVersions.length) {
        setActiveVersions(getInitVersions(versions));
      }
      setAvailableVersions(versions);
    });
    // does not need to refetch after initial fetch
    // also falls back to server side fetch for branches
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // tracks active versions across app
  const [activeVersions, setActiveVersions] = useReducer(versionStateReducer, getLocalValue(STORAGE_KEY) || []);
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
