import React, { createContext, useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { navigate } from '@gatsbyjs/reach-router';
import { BRANCHES_COLLECTION, METADATA_COLLECTION } from '../build-constants';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { useCurrentUrlSlug } from '../hooks/use-current-url-slug';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';
import { fetchDocument, fetchDocuments } from '../utils/realm';
import { getUrl } from '../utils/url-utils';
import useSnootyMetadata from '../utils/use-snooty-metadata';

// <-------------- begin helper functions -------------->
const STORAGE_KEY = 'activeVersions';
const LEGACY_GIT_BRANCH = 'legacy';

const getInitBranchName = (branches) => {
  const activeBranch = branches.find((b) => b.active);
  if (activeBranch) {
    return activeBranch.gitBranchName;
  }
  return branches[0]?.gitBranchName || null;
};

const getInitVersions = (branchListByProduct) => {
  const initState = {};
  const localStorage = getLocalValue(STORAGE_KEY);
  for (const productName in branchListByProduct) {
    initState[productName] = localStorage?.[productName] || getInitBranchName(branchListByProduct[productName]);
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
  let hasEolBranches = false;
  try {
    const promises = [fetchDocument(metadata.reposDatabase, BRANCHES_COLLECTION, { project: metadata.project })];
    for (let associatedProduct of associatedProducts) {
      promises.push(
        fetchDocument(metadata.reposDatabase, BRANCHES_COLLECTION, {
          project: associatedProduct.name,
        })
      );
    }
    const allBranches = await Promise.all(promises);
    const fetchedRepoBranches = allBranches[0];
    hasEolBranches = fetchedRepoBranches?.branches?.some((b) => !b.active);
    const fetchedAssociatedReposInfo = allBranches.slice(1).reduce((res, repoBranch) => {
      res[repoBranch.project] = repoBranch;
      return res;
    }, {});
    const versions = getDefaultVersions(metadata.project, fetchedRepoBranches, fetchedAssociatedReposInfo);
    const groups = getDefaultGroups(metadata.project, fetchedRepoBranches);

    return { versions, groups, hasEolBranches };
  } catch (e) {
    return {
      versions: getDefaultVersions(metadata.project, repoBranches, associatedReposInfo),
      groups: getDefaultGroups(metadata.project, repoBranches),
      hasEolBranches,
    };
    // on error of realm function, fall back to build time fetches
  }
};

const getDefaultVersions = (project, repoBranches, associatedReposInfo) => {
  const versions = {};
  const VERSION_KEY = 'branches';
  const activeFilter = (b) => b.active;
  versions[project] = (repoBranches?.[VERSION_KEY] || []).filter(activeFilter);
  for (const productName in associatedReposInfo) {
    versions[productName] = (associatedReposInfo[productName][VERSION_KEY] || []).filter(activeFilter);
  }
  return versions;
};

const getDefaultGroups = (project, repoBranches) => {
  const groups = {};
  const GROUP_KEY = 'groups';
  groups[project] = repoBranches?.[GROUP_KEY] || [];
  return groups;
};

const getDefaultActiveVersions = (metadata) => {
  // for current metadata.project, should always default to metadata.parserBranch
  const { project, parserBranch } = metadata;
  let versions = {};
  versions[project] = parserBranch;
  // for any umbrella / associated products
  // we should depend on local storage after data fetch
  // otherwise, setting init on build will be overwritten by local storage
  // and result in double render
  return versions;
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
  availableGroups: {},
  setAvailableVersions: () => {},
  showVersionDropdown: false,
  showEol: false,
  onVersionSelect: () => {},
});

const VersionContextProvider = ({ repoBranches, associatedReposInfo, isAssociatedProduct, slug, children }) => {
  const metadata = useSiteMetadata();
  const { associated_products: associatedProducts } = useSnootyMetadata();
  const mountRef = useRef(true);

  // TODO check whats going on here for 404 pages
  // tracks active versions across app
  const [activeVersions, setActiveVersions] = useReducer(versionStateReducer, metadata, getDefaultActiveVersions);
  // update local storage when active versions change
  useEffect(() => {
    const existing = getLocalValue(STORAGE_KEY);
    setLocalValue(STORAGE_KEY, { ...existing, ...activeVersions });
    return () => {
      mountRef.current = false;
    };
  }, [activeVersions]);

  // expose the available versions for current and associated products
  const [availableVersions, setAvailableVersions] = useState(
    getDefaultVersions(metadata.project, repoBranches, associatedReposInfo)
  );
  const [availableGroups, setAvailableGroups] = useState(
    getDefaultGroups(metadata.project, repoBranches, associatedReposInfo)
  );
  const [showEol, setShowEol] = useState(repoBranches['branches']?.some((b) => !b.active) || false);

  // on init, fetch versions from realm app services
  useEffect(() => {
    getBranches(metadata, repoBranches, associatedReposInfo, associatedProducts || []).then(
      ({ versions, groups, hasEolBranches }) => {
        if (!mountRef.current) {
          return;
        }
        setActiveVersions(getInitVersions(versions));
        setAvailableGroups(groups);
        setAvailableVersions(versions);
        setShowEol(hasEolBranches);
      }
    );
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
      if (!targetBranch && gitBranchName !== LEGACY_GIT_BRANCH) {
        console.error(`target branch not found for git branch <${gitBranchName}>`);
        return;
      }
      const target =
        gitBranchName === LEGACY_GIT_BRANCH
          ? gitBranchName
          : targetBranch.urlSlug || targetBranch.urlAliases[0] || targetBranch.gitBranchName;
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
      const newState = { ...activeVersions };
      newState[metadata.project] = currentBranch.gitBranchName;
      setActiveVersions(newState);
    }
  }, [activeVersions, currentUrlSlug, findBranchByAlias, metadata.project, setActiveVersions]);

  return (
    <VersionContext.Provider
      value={{
        activeVersions,
        setActiveVersions,
        availableVersions,
        availableGroups,
        showVersionDropdown,
        onVersionSelect,
        showEol,
      }}
    >
      {children}
    </VersionContext.Provider>
  );
};

export { VersionContext, VersionContextProvider, STORAGE_KEY };
