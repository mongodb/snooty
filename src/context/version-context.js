import React, { createContext, useReducer, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { navigate } from '@gatsbyjs/reach-router';
import { METADATA_COLLECTION } from '../build-constants';
import { useAllDocsets } from '../hooks/useAllDocsets';
import { useAllAssociatedProducts } from '../hooks/useAssociatedProducts';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { useCurrentUrlSlug } from '../hooks/use-current-url-slug';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';
import { fetchDocset, fetchDocument } from '../utils/realm';
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
  console.log('i am in init branch name', branches, branches[0]?.gitBranchName);
  return branches[0]?.gitBranchName || null;
};

const getInitVersions = (branchListByProduct) => {
  const initState = {};
  const localStorage = getLocalValue(STORAGE_KEY);
  for (const productName in branchListByProduct) {
    initState[productName] = localStorage?.[productName] || getInitBranchName(branchListByProduct[productName]);
  }
  console.log('i am in init versions', branchListByProduct, initState);
  return initState;
};

const findBranchByGit = (gitBranchName, branches) => {
  if (!branches || !branches.length) {
    return;
  }

  return branches.find((b) => b.gitBranchName === gitBranchName);
};

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
    const promises = [fetchDocset(metadata.reposDatabase, { project: metadata.project })];
    for (let associatedProduct of associatedProducts) {
      promises.push(
        fetchDocset(metadata.reposDatabase, {
          project: associatedProduct,
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
    const versions = getDefaultVersions(metadata, fetchedRepoBranches, fetchedAssociatedReposInfo);
    const groups = getDefaultGroups(metadata.project, fetchedRepoBranches);

    return { versions, groups, hasEolBranches };
  } catch (e) {
    return {
      versions: getDefaultVersions(metadata, repoBranches, associatedReposInfo),
      groups: getDefaultGroups(metadata.project, repoBranches),
      hasEolBranches,
    };
    // on error of realm function, fall back to build time fetches
  }
};

const getDefaultVersions = (metadata, repoBranches, associatedReposInfo) => {
  const { project, parserBranch } = metadata;
  const versions = {};
  const VERSION_KEY = 'branches';
  const currentBranch = repoBranches?.[VERSION_KEY]?.find((b) => b.gitBranchName === parserBranch);
  const filter = !currentBranch || currentBranch.active ? (b) => b.active : () => true;
  versions[project] = (repoBranches?.[VERSION_KEY] || []).filter(filter);
  for (const productName in associatedReposInfo) {
    versions[productName] = (associatedReposInfo[productName][VERSION_KEY] || []).filter(filter);
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

  console.log('i am in default active versions', parserBranch);
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
    const umbrellaProject = await fetchDocument(dbName, METADATA_COLLECTION, query);
    return umbrellaProject;
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
  hasEmbeddedVersionDropdown: false,
  showEol: false,
  isAssociatedProduct: false,
  onVersionSelect: () => {},
});

const VersionContextProvider = ({ repoBranches, slug, children }) => {
  const siteMetadata = useSiteMetadata();
  const associatedProductNames = useAllAssociatedProducts();
  const docsets = useAllDocsets();
  const { project } = useSnootyMetadata();
  const associatedReposInfo = useMemo(
    () =>
      associatedProductNames.reduce((res, productName) => {
        res[productName] = docsets.find((docset) => docset.project === productName);
        return res;
      }, {}),
    [associatedProductNames, docsets]
  );

  const isAssociatedProduct = useMemo(
    () => associatedProductNames.includes(project),
    [associatedProductNames, project]
  );
  const metadata = useMemo(() => {
    return {
      ...siteMetadata,
      project,
    };
  }, [siteMetadata, project]);
  const mountRef = useRef(true);

  // TODO: Might need to update this once we use this branch on a stitched project (DOP-5243 dependent)
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
    getDefaultVersions(metadata, repoBranches, associatedReposInfo)
  );
  const [availableGroups, setAvailableGroups] = useState(
    getDefaultGroups(metadata.project, repoBranches, associatedReposInfo)
  );
  const [showEol, setShowEol] = useState(repoBranches?.branches?.some((b) => !b.active) || false);

  // on init, fetch versions from realm app services
  useEffect(() => {
    getBranches(metadata, repoBranches, associatedReposInfo, associatedProductNames).then(
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

  const [hasEmbeddedVersionDropdown, setHasEmbeddedVersionDropdown] = useState(isAssociatedProduct);
  useEffect(() => {
    getUmbrellaProject(metadata.project, metadata.database).then((umbrellaMetadata) => {
      if (!mountRef.current) {
        return;
      }
      setHasEmbeddedVersionDropdown(!!umbrellaMetadata);
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
      const urlTarget = getUrl(target, metadata.project, repoBranches?.siteBasePrefix, slug);
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
    // MAYBE NEED TO CHANGE THIS
    if (activeVersions[metadata.project] !== currentBranch.gitBranchName) {
      const newState = { ...activeVersions };
      newState[metadata.project] = currentBranch.gitBranchName;
      console.log('i shouldnt be here', newState, currentBranch.gitBranchName, activeVersions[metadata.project]);
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
        hasEmbeddedVersionDropdown,
        onVersionSelect,
        isAssociatedProduct,
        showEol,
      }}
    >
      {children}
    </VersionContext.Provider>
  );
};

export { VersionContext, VersionContextProvider, STORAGE_KEY };
