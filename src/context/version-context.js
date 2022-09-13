import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';
import { useSiteMetadata } from '../hooks/use-site-metadata';

const VersionContext = createContext({
  activeVersions: {},
  // active version for each product is marked is {[product name]: active version} pair
  setActiveVersions: () => {},
  availableVersions: {},
});

const STORAGE_KEY = 'activeVersions';

const getBranchName = (branch) => {
  return branch['name'];
};

function getInitBranch(repoBranches) {
  if (repoBranches?.branches?.length === 1) {
    return getBranchName(repoBranches.branches[0]);
  }
  return getBranchName(repoBranches?.branches?.find((b) => b.active));
}

const reducer = (state, { project, version }) => {
  return {
    ...state,
    [project]: version,
  };
};

// return initial active versions of documents if not found in local storage
function getInitVersions(metadata, repoBranches) {
  const initState = {};
  // set version state of current project
  initState[`${metadata.project}`] = getInitBranch(repoBranches);
  // for each associated product, set version state
  metadata.associatedProducts.forEach((product) => {
    initState[product.name] = product.versions.sort((a, b) => b - a)[0];
  });
  return initState;
}

const VersionContextProvider = ({ repoBranches, children }) => {
  const metadata = useSiteMetadata();

  // this context logic tracks active versions across MongoDB docs
  const [activeVersions, setActiveVersions] = useReducer(
    reducer,
    getLocalValue(STORAGE_KEY) || getInitVersions(metadata, repoBranches)
  );
  // update local storage when active versions change
  useEffect(() => {
    setLocalValue(STORAGE_KEY, activeVersions);
  }, [activeVersions]);

  // expose the available versions for current and associated products
  const availableVersions = useMemo(() => {
    const versions = {};
    versions[metadata.project] = repoBranches?.branches.map((b) => b.name);
    metadata.associatedProducts.forEach((product) => {
      versions[product.name] = product.versions;
    });
    return versions;
    // currently does not need to recompute after loading from manifest files
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VersionContext.Provider value={{ activeVersions, setActiveVersions, availableVersions }}>
      {children}
    </VersionContext.Provider>
  );
};

export { VersionContext, VersionContextProvider };
