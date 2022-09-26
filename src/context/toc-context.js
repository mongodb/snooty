import React, { createContext, useContext, useEffect, useState } from 'react';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import { VersionContext } from './version-context';

const TocContext = createContext({
  activeToc: {}, // table of contents
  // TODO: doc format of contents
});

const filterTocByVersion = function (tocTree = {}, currentVersion = {}, availableVersions = {}) {
  if (
    Object.keys(tocTree).length === 0 ||
    Object.keys(availableVersions).length === 0 ||
    Object.keys(currentVersion).length === 0
  ) {
    return tocTree;
  }
  // Q: how to filter by options.version and current versions?
  // ie. v1.1.0 with atlas cli
  // vs v1.1.0 with atlas-cli
  // need to verify consistency of gitBranchName in "versions"
  // need project name in versions

  // if i mutate toctree, will it still be reset to full tree, since using useSnootyMetadata?
  tocTree.children = tocTree?.children?.filter((child) => {
    // if it has "versions" in options, filter those versions by available versions
    // don't include this child if available versions does not match
    // also should filter this toctree.children[].children[] by current version
    if (child.options?.versions) {
      child.options.versions = child.options.versions.filter((version) =>
        availableVersions[child.slug].map((branchObj) => branchObj['gitBranchName']).includes(version)
      );
      child.children = child.children?.filter(
        (versionedChild) => currentVersion[child.slug] === versionedChild.options.version
      );
      return child.options.versions.length ? child : false;
    }
    return child;
  });

  return tocTree;
};

// ToC context that provides ToC content in form of *above*
// filters all available ToC by currently selected version via VersionContext
const TocContextProvider = ({ children }) => {
  const { activeVersions, availableVersions } = useContext(VersionContext);
  const { toctree } = useSnootyMetadata();
  const [activeToc, setActiveToc] = useState({});

  // TODO: client side call to get Toc Metadata from Atlas
  // useEffect(() => {
  //   getTocMetadata().then((toctree) => setBaseTocTree(toctree))
  // }, []);

  useEffect(() => {
    const filtered = filterTocByVersion(toctree, activeVersions, availableVersions);
    console.log('filtered');
    console.log(filtered);
    setActiveToc(filtered);
  }, [activeVersions, toctree, availableVersions]);

  return <TocContext.Provider value={{ activeToc }}>{children}</TocContext.Provider>;
};

export { TocContext, TocContextProvider };
