import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCallback } from 'react';
import { METADATA_COLLECTION } from '../build-constants';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { fetchDocument } from '../utils/realm';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import { VersionContext } from './version-context';

const TocContext = createContext({
  activeToc: {}, // table of contents, represented by head node
});

// ToC context that provides ToC content in form of *above*
// filters all available ToC by currently selected version via VersionContext
const TocContextProvider = ({ children, remoteMetadata }) => {
  const { activeVersions, setActiveVersions, availableVersions, hasEmbeddedVersionDropdown } =
    useContext(VersionContext);
  const { project, branch, toctree, associated_products: associatedProducts } = useSnootyMetadata();
  const { database } = useSiteMetadata();
  const [activeToc, setActiveToc] = useState(remoteMetadata?.toctree || toctree);
  const [isLoaded, setIsLoaded] = useState(false);

  const getTocMetadata = useCallback(async () => {
    try {
      const filter = {
        project,
        branch,
      };
      const findOptions = {
        sort: { build_id: -1 },
      };

      if (associatedProducts?.length || hasEmbeddedVersionDropdown) {
        filter['is_merged_toc'] = true;
      }
      const metadata = await fetchDocument(database, METADATA_COLLECTION, filter, { toctree: 1 }, findOptions);
      return metadata?.toctree ?? toctree;
    } catch (e) {
      // fallback to toctree from build time
      console.error(e);
      return remoteMetadata?.toctree || toctree;
    }
    // below dependents are server constants
  }, [
    toctree,
    project,
    branch,
    associatedProducts?.length,
    hasEmbeddedVersionDropdown,
    database,
    remoteMetadata?.toctree,
  ]);

  const setInitVersion = useCallback(
    (tocNode) => {
      // for ToC with project option
      // set an active version for this project
      // if it doesn't already exist
      // NOTE: do we need to traverse full ToC tree? for now just immediate children
      for (let node of tocNode.children) {
        if (!node?.options?.versions || !node?.options?.project || !activeVersions[node.options.project]) {
          continue;
        }
        if (!node.options.versions.includes(activeVersions[node.options.project])) {
          // assumption is that first branch in pool.repos_branches
          // exists as a toc node here. otherwise, fallback to first ToC option
          const gitBranchNames = availableVersions[node.options.project].map((b) => b.gitBranchName);
          const intersection = gitBranchNames.filter((b) => node.options.versions.includes(b));
          setActiveVersions({
            [node.options.project]: intersection.length ? intersection[0] : node.options.versions[0],
          });
        }
      }
    },
    [activeVersions, setActiveVersions, availableVersions]
  );

  // initial effect is to fetch metadata
  // should only run once on init
  useEffect(() => {
    if (!Object.keys(activeVersions).length || isLoaded) {
      return;
    }
    getTocMetadata().then((tocTreeResponse) => {
      setInitVersion(tocTreeResponse);
      setActiveToc(tocTreeResponse);
      setIsLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVersions]);

  return <TocContext.Provider value={{ activeToc }}>{children}</TocContext.Provider>;
};

export { TocContext, TocContextProvider };
