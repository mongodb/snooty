import React, { createContext, useContext, useEffect, useState } from 'react';
import { METADATA_COLLECTION } from '../build-constants';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { fetchDocument } from '../utils/realm';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import { VersionContext } from './version-context';

const TocContext = createContext({
  activeToc: {}, // table of contents
  setActiveToc: () => {},
});

/**
 *
 * @param {object} tocTree toc tree head node
 * @param {object} currentVersion see version-context currentVersion{}
 * @param {object} availableVersions see version-context availableVersions{}
 * @returns
 */
const filterTocByVersion = function (tocTree = {}, currentVersion = {}, availableVersions = {}) {
  const clonedToc = { ...tocTree };
  if (
    Object.keys(tocTree).length === 0 ||
    Object.keys(availableVersions).length === 0 ||
    Object.keys(currentVersion).length === 0
  ) {
    return clonedToc;
  }
  clonedToc.children =
    clonedToc?.children?.filter((child) => {
      // tocTree child.options.versions exists if it is specific to a version
      // if no version, include the child
      if (!child?.options?.versions) {
        return true;
      }
      const childProject = child.options.project;

      // filter ToC version options by version context
      child.options.versions = child.options.versions.filter((version) =>
        availableVersions[childProject]?.map((branchObj) => branchObj['gitBranchName']).includes(version)
      );

      // if ToC and version context don't match, don't show versioned ToC children
      if (!child.options.versions.length) {
        return false;
      }

      let targetVersion = currentVersion[childProject];
      // if current version is not part of merged ToC, fallback to last
      if (!targetVersion || !child.options.versions.includes(targetVersion)) {
        targetVersion = child.options.versions[child.options.version.length - 1];
        // NOTE. not updating version context since active versions should be most recent to their homepage
      }
      child.children = child.children?.filter((versionedChild) => versionedChild.options?.version === targetVersion);
      return child;
    }) || [];

  return clonedToc;
};

const getTocMetadata = async (db, project, parserUser, parserBranch, manifestTree) => {
  try {
    let filter = {
      page_id: `${project}/${parserUser}/${parserBranch}`,
    };
    if (process.env.GATSBY_TEST_EMBED_VERSIONS && project === 'cloud-docs') {
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
  // TODO: optimization: useMemo here to have memoized version of activeToc

  useEffect(() => {
    getTocMetadata(database, project, parserUser, parserBranch, toctree).then((toctreeResponse) => {
      const filtered = filterTocByVersion(toctreeResponse, activeVersions, availableVersions);
      console.log('setting filtered');
      console.log(JSON.stringify(filtered.children[filtered.children.length - 1]));
      setActiveToc(filtered);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <TocContext.Provider value={{ activeToc }}>{children}</TocContext.Provider>;
};

export { TocContext, TocContextProvider };
