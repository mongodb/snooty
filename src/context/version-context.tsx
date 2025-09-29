import React, {
  createContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
  Dispatch,
} from 'react';
// @ts-ignore
import { navigate } from '@gatsbyjs/reach-router';
import { METADATA_COLLECTION } from '../build-constants';
import { DocsetSlice, useAllDocsets } from '../hooks/useAllDocsets';
import { useAllAssociatedProducts } from '../hooks/useAssociatedProducts';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { useCurrentUrlSlug } from '../hooks/use-current-url-slug';
import { getLocalValue, setLocalValue } from '../utils/browser-storage';
import { getUrl } from '../utils/url-utils';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import { getFeatureFlags } from '../utils/feature-flags';
import { BranchData, Docset, Group, MetadataDatabaseName, PageContextRepoBranches, SiteMetadata } from '../types/data';
import { reportAnalytics } from '../utils/report-analytics';
import { fetchDocset } from '../utils/data/docsets';
import { fetchDocument } from '../utils/data/documents';

export type AssociatedReposInfo = Record<string, DocsetSlice>;
export type ActiveVersions = Record<string, string>;
export type AvailableVersions = Record<string, BranchData[]>;
export type AvailableGroups = Record<string, Group[]>;

// <-------------- begin helper functions -------------->
const STORAGE_KEY = 'activeVersions';
const LEGACY_GIT_BRANCH = 'legacy';

const getInitBranchName = (branches: BranchData[]) => {
  // Find 'current' branch as first option
  const currentBranch = branches.find(
    (b) => b.urlSlug === 'current' || b.gitBranchName === 'current' || b.urlAliases?.includes('current')
  );
  if (currentBranch) {
    return currentBranch.gitBranchName;
  }
  const activeBranch = branches.find((b) => b.active);
  if (activeBranch) {
    return activeBranch.gitBranchName;
  }
  return branches[0]?.gitBranchName || null;
};

const getInitVersions = (branchListByProduct: AvailableVersions) => {
  const initState: Record<string, string> = {};
  const localStorage = getLocalValue(STORAGE_KEY);
  for (const productName in branchListByProduct) {
    initState[productName] = localStorage?.[productName] || getInitBranchName(branchListByProduct[productName]);
  }
  return initState;
};

const findBranchByGit = (gitBranchName: string, branches?: BranchData[]) => {
  if (!branches || !branches.length) {
    return;
  }
  return branches.find(
    (b) => b.urlSlug === gitBranchName || b.gitBranchName === gitBranchName || b?.urlAliases?.includes(gitBranchName)
  );
};

// version state reducer helper fn
// overwrite current state with any new state attributes
const versionStateReducer = (state: ActiveVersions, newState: Partial<ActiveVersions>) => {
  // Cleans any undefined values - type safety
  const cleaned = Object.fromEntries(
    Object.entries(newState).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  );

  return {
    ...state,
    ...cleaned,
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
const getBranches = async (
  metadata: SiteMetadata,
  repoBranches: PageContextRepoBranches,
  associatedReposInfo: AssociatedReposInfo,
  associatedProducts: string[],
  docsets: DocsetSlice[],
  isUnifiedToc: boolean
) => {
  let hasEolBranches = false;
  try {
    const promises = [fetchDocset(metadata.reposDatabase, metadata.project)];
    for (let associatedProduct of associatedProducts) {
      promises.push(fetchDocset(metadata.reposDatabase, associatedProduct));
    }
    const allBranches = await Promise.all(promises);
    const fetchedRepoBranches = allBranches[0];
    hasEolBranches = fetchedRepoBranches?.branches?.some((b) => !b.active);
    const fetchedAssociatedReposInfo = allBranches.slice(1).reduce<{ [k: string]: Docset }>((res, repoBranch) => {
      res[repoBranch.project] = repoBranch;
      return res;
    }, {});

    if (isUnifiedToc) {
      const versions = getDefaultVersionsUnified(docsets);
      const groups = getDefaultGroupsUnified(docsets);
      return { versions, groups, hasEolBranches };
    } else {
      const versions = getDefaultVersions(metadata, fetchedRepoBranches, fetchedAssociatedReposInfo);
      const groups = getDefaultGroups(metadata.project, fetchedRepoBranches);
      return { versions, groups, hasEolBranches };
    }
  } catch (e) {
    if (isUnifiedToc) {
      return {
        versions: getDefaultVersionsUnified(docsets),
        groups: getDefaultGroupsUnified(docsets),
        hasEolBranches,
      };
    } else {
      return {
        versions: getDefaultVersions(metadata, repoBranches, associatedReposInfo),
        groups: getDefaultGroups(metadata.project, repoBranches),
        hasEolBranches,
      };
    }
    // on error of realm function, fall back to build time fetches
  }
};

const getDefaultVersions = (
  metadata: SiteMetadata,
  repoBranches: PageContextRepoBranches | Docset,
  associatedReposInfo: AssociatedReposInfo
) => {
  const { project, parserBranch } = metadata;
  const versions: { [k: string]: Docset['branches'] } = {};
  const VERSION_KEY = 'branches';
  const currentBranch = repoBranches?.[VERSION_KEY]?.find((b) => b.gitBranchName === parserBranch);
  const filter = !currentBranch || currentBranch.active ? (b: BranchData) => b.active : () => true;
  versions[project] = (repoBranches?.[VERSION_KEY] || []).filter(filter);
  for (const productName in associatedReposInfo) {
    versions[productName] = (associatedReposInfo[productName][VERSION_KEY] || []).filter(filter);
  }
  return versions;
};

const getDefaultGroups = (project: string, repoBranches: PageContextRepoBranches | Docset) => {
  const groups: AvailableGroups = {};
  const GROUP_KEY = 'groups';
  groups[project] = repoBranches?.[GROUP_KEY] || [];
  return groups;
};

const getDefaultVersionsUnified = (docsets: DocsetSlice[]) => {
  const versions: { [k: string]: Docset['branches'] } = {};

  for (const docset of docsets) {
    // Skips none versioned sites
    if (!docset.branches || docset.branches.length <= 1) {
      continue;
    }
    versions[docset.project] = docset.branches.filter((version) => version.active === true);
  }

  return versions;
};

const getDefaultGroupsUnified = (docsets: DocsetSlice[]) => {
  const groups: AvailableGroups = {};

  for (const docset of docsets) {
    groups[docset.project] = docset?.groups || [];
  }

  return groups;
};

const getDefaultActiveVersions = (metadata: SiteMetadata) => {
  // for current metadata.project, should always default to metadata.parserBranch
  const { project, parserBranch } = metadata;
  const versions: Record<string, string> = {};
  versions[project] = parserBranch;
  // for any umbrella / associated products
  // we should depend on local storage after data fetch
  // otherwise, setting init on build will be overwritten by local storage
  // and result in double render
  return versions;
};

const getUmbrellaProject = async (project: string, dbName: MetadataDatabaseName) => {
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

export type VersionContextType = {
  activeVersions: ActiveVersions;
  // active version for each product is marked is {[product name]: active version} pair
  setActiveVersions: Dispatch<Partial<ActiveVersions>>;
  availableVersions: AvailableVersions;
  availableGroups: AvailableGroups;
  hasEmbeddedVersionDropdown: boolean;
  showEol: boolean;
  isAssociatedProduct: boolean;
  onVersionSelect: (targetProject: string, gitBranchName: string) => void;
};

const VersionContext = createContext<VersionContextType>({
  activeVersions: {},
  // active version for each product is marked is {[product name]: active version} pair
  setActiveVersions: () => {},
  availableVersions: {},
  availableGroups: {},
  hasEmbeddedVersionDropdown: false,
  showEol: false,
  isAssociatedProduct: false,
  onVersionSelect: () => {},
});

interface VersionContextProviderProps {
  children: ReactNode;
  slug: string;
  repoBranches: PageContextRepoBranches;
}

const VersionContextProvider = ({ repoBranches, slug, children }: VersionContextProviderProps) => {
  const siteMetadata = useSiteMetadata();
  const associatedProductNames = useAllAssociatedProducts();
  const docsets = useAllDocsets();
  const { project } = useSnootyMetadata();
  const { isUnifiedToc } = getFeatureFlags();
  const associatedReposInfo = useMemo(
    () =>
      associatedProductNames.reduce<AssociatedReposInfo>((res, productName) => {
        const docset = docsets.find((docset) => docset.project === productName);
        if (docset) res[productName] = docset;
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
  const [activeVersions, setActiveVersions] = useReducer<
    React.Reducer<ActiveVersions, Partial<ActiveVersions>>,
    SiteMetadata
  >(versionStateReducer, metadata, getDefaultActiveVersions);
  // update local storage when active versions change
  useEffect(() => {
    const existing = getLocalValue(STORAGE_KEY);
    setLocalValue(STORAGE_KEY, { ...existing, ...activeVersions });
    return () => {
      mountRef.current = false;
    };
  }, [activeVersions]);

  // expose the available versions for current and associated products
  const [availableVersions, setAvailableVersions] = useState<AvailableVersions>(
    isUnifiedToc ? getDefaultVersionsUnified(docsets) : getDefaultVersions(metadata, repoBranches, associatedReposInfo)
  );
  const [availableGroups, setAvailableGroups] = useState(
    isUnifiedToc ? getDefaultGroupsUnified(docsets) : getDefaultGroups(metadata.project, repoBranches)
  );
  const [showEol, setShowEol] = useState(repoBranches?.branches?.some((b) => !b.active) || false);

  // on init, fetch versions from realm app services
  useEffect(() => {
    getBranches(metadata, repoBranches, associatedReposInfo, associatedProductNames, docsets, isUnifiedToc).then(
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
    (targetProject: string, gitBranchName: string) => {
      const updatedVersion: Record<string, string> = {};
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
          : targetBranch?.urlSlug || targetBranch?.urlAliases?.[0] || targetBranch?.gitBranchName;
      const urlTarget = getUrl(target, metadata.project, repoBranches?.siteBasePrefix, slug);
      reportAnalytics('VersionSelection', {
        event: 'Click',
        eventDescription: 'Version Selection',
        properties: {
          position: 'sidenav',
          position_context: urlTarget,
          label: target,
          label_text_displayed: target,
        },
      });
      navigate(urlTarget);
    },
    [availableVersions, metadata, repoBranches, slug]
  );

  // attempts to find branch by given url alias. can be alias, urlAliases, or gitBranchName
  const findBranchByAlias = useCallback(
    (alias: string) => {
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

    if (!isUnifiedToc && activeVersions[metadata.project] !== currentBranch.gitBranchName) {
      const newState = { ...activeVersions };
      newState[metadata.project] = currentBranch.gitBranchName;
      setActiveVersions(newState);
    }
  }, [activeVersions, currentUrlSlug, findBranchByAlias, metadata.project, setActiveVersions, isUnifiedToc]);

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
