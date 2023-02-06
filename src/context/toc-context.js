import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCallback } from 'react';
import { METADATA_COLLECTION } from '../build-constants';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { fetchDocuments } from '../utils/realm';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import { VersionContext } from './version-context';

const TocContext = createContext({
  activeToc: {}, // table of contents, represented by head node
});

// ToC context that provides ToC content in form of *above*
// filters all available ToC by currently selected version via VersionContext
const TocContextProvider = ({ children, remoteMetadata }) => {
  const { activeVersions, setActiveVersions, showVersionDropdown } = useContext(VersionContext);
  const { toctree, associated_products: associatedProducts } = useSnootyMetadata();
  const { database, project, parserBranch } = useSiteMetadata();
  const [remoteToc, setRemoteToc] = useState();
  const [activeToc, setActiveToc] = useState(remoteMetadata?.toctree || toctree);

  const getTocMetadata = useCallback(async () => {
    try {
      let filter = {
        project: `${project}`,
        branch: parserBranch,
      };
      let findOptions = {
        sort: { build_id: -1 },
      };

      if (associatedProducts?.length || showVersionDropdown) {
        filter['is_merged_toc'] = true;
      }
      let db = database;
      const metadata = await fetchDocuments(db, METADATA_COLLECTION, filter, undefined, findOptions);
      return metadata[0]?.toctree ?? toctree;
    } catch (e) {
      // fallback to toctree from build time
      console.error(e);
      return remoteMetadata?.toctree || toctree;
    }
    // below dependents are server constants
  }, [project, parserBranch, associatedProducts, showVersionDropdown, database, toctree, remoteMetadata]);

  const getFilteredToc = useCallback(() => {
    // filter remoteToc by activeVersions and return a copy
    let { children, ...clonedToc } = remoteToc;
    clonedToc.children = [];
    for (let node of remoteToc.children) {
      // push any non versions children
      if (!node?.options?.versions) {
        clonedToc.children.push(node);
        continue;
      }

      const nodeProject = node.options?.project;
      const activeVersion = activeVersions[nodeProject];
      // if selected version is not included in ToC, skip
      if (node?.options?.versions && !node.options.versions.includes(activeVersion)) {
        console.error(`selected version ${activeVersion} for project ${nodeProject} does not exist in ToC`);
        continue;
      }
      // clone any versioned node not to mutate remoteToc
      let { children, ...clonedNode } = node;
      clonedNode.children = [];
      for (let optionedNode of node.children) {
        if (optionedNode?.options?.version === activeVersion) {
          clonedNode.children.push(optionedNode);
        }
      }

      if (clonedNode.children?.length) {
        clonedToc.children.push(clonedNode);
      }
    }
    return clonedToc;
  }, [activeVersions, remoteToc]);

  const correctActiveVersion = useCallback(
    (tocNode) => {
      // go through toc tree and see if any active versions are not available
      // fall back to most recent if not available
      const newVersions = {};
      for (let node of tocNode.children) {
        if (!node?.options?.versions || !node?.options?.project) {
          continue;
        }
        if (!node.options.versions.includes(activeVersions[node.options.project])) {
          newVersions[node.options.project] = node.options.versions[0];
        }
      }

      if (Object.keys(newVersions).length) {
        setActiveVersions(newVersions);
      }
    },
    [activeVersions, setActiveVersions]
  );

  // initial effect is to fetch metadata
  // should only run once on init
  useEffect(() => {
    if (remoteToc) {
      return;
    }
    getTocMetadata().then((tocTreeResponse) => {
      correctActiveVersion(tocTreeResponse);
      setRemoteToc(tocTreeResponse);
    });
  }, [remoteToc, setRemoteToc, getTocMetadata, correctActiveVersion]);

  // one effect depends on activeVersions
  // if activeVersion changes -> setActiveToc
  useEffect(() => {
    if (!remoteToc) {
      return;
    }
    const filteredToc = getFilteredToc();
    setActiveToc(filteredToc);
  }, [remoteToc, activeVersions, setActiveToc, getFilteredToc]);

  return <TocContext.Provider value={{ activeToc }}>{children}</TocContext.Provider>;
};

export { TocContext, TocContextProvider };
