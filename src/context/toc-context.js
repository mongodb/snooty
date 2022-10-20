import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
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
const TocContextProvider = ({ children }) => {
  const { activeVersions, setActiveVersions } = useContext(VersionContext);
  const { toctree } = useSnootyMetadata();
  const { database, project } = useSiteMetadata();
  const [remoteToc, setRemoteToc] = useState();
  const [activeToc, setActiveToc] = useState({});
  const mountedRef = useRef(true);

  const getTocMetadata = useCallback(async () => {
    try {
      // TODO: update metadata to have 'project' field. don't have to construct page_id
      // NOTE: see snooty_dev.metadata for documents with 'project' field defined. input testing metadata
      let filter = {
        project: `${project}`,
      };
      // TODO: remove testing code
      let db = database;
      if (process.env.GATSBY_TEST_EMBED_VERSIONS && project === 'cloud-docs') {
        db = 'snooty_dev';
      }
      const metadata = await fetchDocument(db, METADATA_COLLECTION, filter);
      return metadata.toctree;
    } catch (e) {
      // fallback to toctree from build time
      console.error(e);
      return toctree;
    }
    // below dependents are server constants
  }, [database, project, toctree]);

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
      for (let node of clonedNode.children) {
        if (node.version === activeVersion) {
          clonedNode.children.push(node);
        }
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
      if (!mountedRef.current) {
        return;
      }
      // TODO: update remoteToC *can mutate* if there is some mismatch between availableVersions and remoteToc
      correctActiveVersion(tocTreeResponse);
      setRemoteToc(tocTreeResponse);
    });

    return () => {
      mountedRef.current = false;
    };
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
