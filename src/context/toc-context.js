import React, { createContext, useContext, useEffect, useState } from 'react';
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
  clonedToc.children = clonedToc?.children?.filter((child) => {
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
  });

  return clonedToc;
};

// ToC context that provides ToC content in form of *above*
// filters all available ToC by currently selected version via VersionContext
const TocContextProvider = ({ children }) => {
  const { activeVersions, availableVersions } = useContext(VersionContext);
  const { toctree } = useSnootyMetadata();
  const [activeToc, setActiveToc] = useState({});
  // TODO: useReducer for setActiveToc

  // TODO: client side call to get Toc Metadata from Atlas
  // useEffect(() => {
  //   getTocMetadata().then((toctree) => setBaseTocTree(toctree))
  // }, []);

  useEffect(() => {
    const filtered = filterTocByVersion(toctree, activeVersions, availableVersions);
    setActiveToc(filtered);
  }, [activeVersions, toctree, availableVersions]);

  return <TocContext.Provider value={{ activeToc }}>{children}</TocContext.Provider>;
};

export { TocContext, TocContextProvider };
