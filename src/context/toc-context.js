import React, { createContext, useContext, useEffect, useState } from 'react';
import { METADATA_COLLECTION } from '../build-constants';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { fetchDocument } from '../utils/realm';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import { VersionContext } from './version-context';

const TocContext = createContext({
  activeToc: {}, // table of contents, represented by head node
});

/**
 *
 * @param {object} tocTree toc tree head node
 * @param {object} currentVersion see version-context currentVersion{}
 * @param {object} availableVersions see version-context availableVersions{}
 * @returns tocTree toc tree head node, with nodes filtered by current and available versions
 */
const filterTocByVersion = function (tocTree = {}, currentVersion = {}, availableVersions = {}) {
  const clonedToc = { ...tocTree };
  if (Object.keys(tocTree).length === 0) {
    return clonedToc;
  }
  clonedToc.children =
    clonedToc.children?.filter((tocNode) => {
      if (!tocNode?.options?.versions) {
        return true;
      }
      const nodeProject = tocNode.options.project;
      const availableVersionNames =
        availableVersions[nodeProject]?.map((branchObj) => branchObj['gitBranchName']) || [];
      // filter ToC version options by version context
      tocNode.options.versions = tocNode.options.versions.filter((version) => availableVersionNames.includes(version));
      // if ToC and version context don't match, don't show versioned ToC children
      if (!tocNode.options.versions.length) {
        return false;
      }

      let targetVersion = currentVersion[nodeProject];
      // if current version is not part of merged ToC, fallback to last
      if (!targetVersion || !tocNode.options.versions.includes(targetVersion)) {
        targetVersion = tocNode.options.versions[tocNode.options.version.length - 1];
      }
      tocNode.children = tocNode.children?.filter(
        (versionedChild) => versionedChild.options?.version === targetVersion
      );
      return tocNode;
    }) || [];

  return clonedToc;
};

const getTocMetadata = async (db, project, parserUser, parserBranch, manifestTree) => {
  try {
    let filter = {
      page_id: `${project}/${parserUser}/${parserBranch}`,
    };
    if (process.env.GATSBY_TEST_EMBED_VERSIONS && project === 'cloud-docs') {
      // TODO: remove testing code
      db = 'snooty_dev';
      filter = {
        page_id: 'cloud-docs/spark/DOP-3225',
      };
    }
    const metadata = await fetchDocument(db, METADATA_COLLECTION, filter);
    return metadata.toctree;
  } catch (e) {
    console.error(e);
    return manifestTree;
  }
};

// ToC context that provides ToC content in form of *above*
// filters all available ToC by currently selected version via VersionContext
const TocContextProvider = ({ children }) => {
  const { activeVersions, availableVersions } = useContext(VersionContext);
  const { toctree } = useSnootyMetadata();
  const { database, project, parserUser, parserBranch } = useSiteMetadata();
  const [activeToc, setActiveToc] = useState({});

  useEffect(() => {
    getTocMetadata(database, project, parserUser, parserBranch, toctree).then((toctreeResponse) => {
      const filtered = filterTocByVersion(toctreeResponse, activeVersions, availableVersions);
      setActiveToc(filtered);
    });
  }, [
    activeVersions,
    availableVersions, // variable dependencies
    database,
    parserBranch,
    parserUser,
    project,
    toctree, // build time constants
  ]);

  return <TocContext.Provider value={{ activeToc }}>{children}</TocContext.Provider>;
};

export { TocContext, TocContextProvider };
