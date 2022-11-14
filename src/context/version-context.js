import React, { createContext, useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { navigate } from '@reach/router';
import { BRANCHES_COLLECTION, METADATA_COLLECTION } from '../build-constants';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { useCurrentUrlSlug } from '../hooks/use-current-url-slug';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';
import { fetchDocument, fetchDocuments } from '../utils/realm';
import { getUrl } from '../utils/url-utils';
import useSnootyMetadata from '../utils/use-snooty-metadata';

// <-------------- begin helper functions -------------->
const STORAGE_KEY = 'activeVersions';

const getInitBranchName = (branches) => {
  const activeBranch = branches.find((b) => b.active);
  if (activeBranch) {
    return activeBranch.gitBranchName;
  }
  return branches[0]?.gitBranchName || null;
};

const getInitVersions = (branchListByProduct) => {
  const initState = {};
  for (const productName in branchListByProduct) {
    initState[productName] = getInitBranchName(branchListByProduct[productName]);
  }
  return initState;
};

const findBranchByGit = (gitBranchName, branches) => {
  if (!branches || !branches.length) {
    return;
  }

  return branches.find((b) => b.gitBranchName === gitBranchName);
};

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
 * to get active branches for
 * 1) current product (from site metadata)
 * 2) associated products list (filter response by SnootyMetadata['associated_products'])
 *
 * @returns versions{} <product_name: branch_object[]>
 */
const getBranches = async (metadata, repoBranches, associatedReposInfo, associatedProducts) => {
  try {
    const versions = {};
    const promises = associatedProducts.map(async (product) => {
      const childRepoBranches = await fetchDocument(metadata.reposDatabase, BRANCHES_COLLECTION, {
        project: product.name,
      });
      // filter all branches of associated repo by associated versions only
      versions[product.name] = childRepoBranches.branches.filter((branch) => {
        return branch.active && product.versions.includes(branch.gitBranchName);
      });
    });
    promises.push(
      fetchDocument(metadata.reposDatabase, BRANCHES_COLLECTION, { project: metadata.project }).then((res) => {
        versions[metadata.project] = res.branches.filter((branch) => branch.active);
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

const getUmbrellaProject = async (project, dbName) => {
  try {
    const query = {
      'associated_products.name': project,
    };
    const umbrellaProjects = fetchDocuments(dbName, METADATA_COLLECTION, query);
    return umbrellaProjects;
  } catch (e) {
    console.error(e);
  }
};
// <-------------- end helper functions -------------->

const VersionContext = createContext({
  activeVersions: {},
  // active version for each product is marked is {[product name]: active version} pair
  setActiveVersions: () => {},
  availableVersions: {},
  showVersionDropdown: false,
  onVersionSelect: () => {},
});

const VersionContextProvider = ({ repoBranches, associatedReposInfo, isAssociatedProduct, slug, children }) => {
  const metadata = useSiteMetadata();
  const { associated_products: associatedProducts } = useSnootyMetadata();
  const mountRef = useRef(true);

  // TODO check whats going on here for 404 pages
  // tracks active versions across app
  const [activeVersions, setActiveVersions] = useReducer(versionStateReducer, getLocalValue(STORAGE_KEY) || {});
  // update local storage when active versions change
  useEffect(() => {
    setLocalValue(STORAGE_KEY, activeVersions);
    return () => {
      mountRef.current = false;
    };
  }, [activeVersions]);

  // expose the available versions for current and associated products
  const [availableVersions, setAvailableVersions] = useState({});
  // on init, fetch versions from realm app services
  useEffect(() => {
    getBranches(metadata, repoBranches, associatedReposInfo, associatedProducts || []).then((versions) => {
      if (!mountRef.current) {
        return;
      }
      if (!activeVersions || !Object.keys(activeVersions).length) {
        setActiveVersions(getInitVersions(versions));
      }
      setAvailableVersions(versions);
    });
    // does not need to refetch after initial fetch
    // also falls back to server side fetch for branches
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showVersionDropdown, setShowVersionDropdown] = useState(isAssociatedProduct);
  useEffect(() => {
    getUmbrellaProject(metadata.project, metadata.database).then((metadataList) => {
      if (!mountRef.current) {
        return;
      }
      setShowVersionDropdown(metadataList.length > 0);
    });
  }, [metadata.project, metadata.database]);

  // handler for selecting version on multiple dropdowns
  const onVersionSelect = useCallback(
    (targetProject, gitBranchName) => {
      const updatedVersion = {};
      updatedVersion[targetProject] = gitBranchName;
      setActiveVersions(updatedVersion);

      // navigate to new URL only if from same project
      if (targetProject !== metadata.project) {
        return;
      }

      const targetBranch = findBranchByGit(gitBranchName, availableVersions[metadata.project]);
      if (!targetBranch) {
        console.error(`target branch not found for git branch <${gitBranchName}>`);
        return;
      }
      const target = targetBranch.urlSlug || targetBranch.urlAliases[0] || targetBranch.gitBranchName;
      const urlTarget = getUrl(target, metadata.project, metadata, repoBranches?.siteBasePrefix, slug);
      navigate(urlTarget);
    },
    [availableVersions, metadata, repoBranches, slug]
  );

  // attempts to find branch by given url alias. can be alias, urlAliases, or gitBranchName
  const findBranchByAlias = useCallback(
    (alias) => {
      if (!availableVersions[metadata.project]) {
        return;
      }

      return availableVersions[metadata.project].find(
        (b) => b.urlSlug === alias || b.urlAliases?.includes(alias) || b.gitBranchName === alias
      );
    },
    [availableVersions, metadata.project]
  );

  // if context values differ from url, fix context.
  // ie. user lands on "upcoming" version URL whilst context stores "stable"
  const currentUrlSlug = useCurrentUrlSlug(metadata.parserBranch, availableVersions[metadata.project]);
  useEffect(() => {
    // if current version differs from browser storage version
    // update browser local storage
    if (!currentUrlSlug) {
      return;
    }
    const currentBranch = findBranchByAlias(currentUrlSlug);
    if (!currentBranch) {
      console.error(`url <${currentUrlSlug}> does not correspond to any current branch`);
      return;
    }
    if (activeVersions[metadata.project] !== currentBranch.gitBranchName) {
      const newState = {};
      newState[metadata.project] = currentBranch.gitBranchName;
      setActiveVersions(newState);
    }
  }, [activeVersions, currentUrlSlug, findBranchByAlias, metadata.project, setActiveVersions]);

  return (
    <VersionContext.Provider
      value={{ activeVersions, setActiveVersions, availableVersions, showVersionDropdown, onVersionSelect }}
    >
      {children}
    </VersionContext.Provider>
  );
};

export { VersionContext, VersionContextProvider, STORAGE_KEY };
