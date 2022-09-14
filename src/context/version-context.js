import React, { createContext, useReducer, useEffect, useState } from 'react';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { fetchDocument } from '../utils/realm';
import { BRANCHES_COLLECTION } from '../build-constants';

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
/**
 * async call to realm app services
 * to get active branches for current+associated products
 * maps and filters results by metadata.associatedProducts
 * @returns versions{} <product_name: branch_object[]>
 */
const getBranches = async (metadata, repoBranches, associatedReposInfo) => {
  try {
    const versions = {};
    const promises = metadata.associatedProducts.map(async (product) => {
      const childRepoBranches = await fetchDocument(metadata.reposDatabase, BRANCHES_COLLECTION, {
        project: product.name,
      });
      // filter all branches of associated repo by associated versions only
      versions[product.name] = childRepoBranches.branches.filter((branch) => {
        return product.versions.includes(branch.gitBranchName);
      });
    });
    promises.push(
      fetchDocument(metadata.reposDatabase, BRANCHES_COLLECTION, { project: metadata.project }).then((res) => {
        versions[metadata.project] = res.branches;
      })
    );
    await Promise.all(promises);
    return versions;
  } catch (e) {
    // on error of realm function, fall back to build time fetches
    const versions = {};
    versions[metadata.project] = repoBranches?.branches || [];
    for (const productName in associatedReposInfo) {
      versions[productName] = associatedReposInfo[productName].branches || [];
    }
    return versions;
  }
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

  // tracks active versions across app
  const [activeVersions, setActiveVersions] = useReducer(versionStateReducer, getLocalValue(STORAGE_KEY) || {});
  // update local storage when active versions change
  useEffect(() => {
    setLocalValue(STORAGE_KEY, activeVersions);
  }, [activeVersions]);

  // expose the available versions for current and associated products
  const [availableVersions, setAvailableVersions] = useState({});
  // on init, fetch versions from realm app services
  useEffect(() => {
    getBranches(metadata, repoBranches, associatedReposInfo).then((versions) => {
      if (!activeVersions || !Object.keys(activeVersions).length) {
        setActiveVersions(getInitVersions(versions));
      }
      setAvailableVersions(versions);
    });
    // does not need to refetch after initial fetch
    // also falls back to server side fetch for branches
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VersionContext.Provider value={{ activeVersions, setActiveVersions, availableVersions }}>
      {children}
    </VersionContext.Provider>
  );
};

export { VersionContext, VersionContextProvider, STORAGE_KEY };
