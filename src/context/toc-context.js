import React, { createContext, useContext, useEffect, useState } from 'react';
import useSnootyMetadata from '../utils/use-snooty-metadata';
import { VersionContext } from './version-context';

const TocContext = createContext({
  activeToc: {}, // table of contents
});

const filterTocByVersion = function (tocTree = {}, currentVersion = {}, availableVersions = {}) {
  if (
    Object.keys(tocTree).length === 0 ||
    Object.keys(availableVersions).length === 0 ||
    Object.keys(currentVersion).length === 0
  ) {
    return tocTree;
  }
  const res = {};
  for (let key in tocTree) {
    if (key !== 'children') {
      res[key] = tocTree[key];
    }
  }

  // want to mutate + filter children. make copies and append to res
  res.children = tocTree?.children?.reduce((newChildren, child) => {
    // if it has "versions" in options, filter those versions by available versions
    // don't include this child if available versions does not match
    // also should filter this toctree.children[].children[] by current version
    const childCopy = {
      options: {},
      children: [],
    };
    for (let key in child) {
      if (!['options', 'children'].includes(key)) {
        childCopy[key] = child[key];
      }
    }
    if (child.options?.versions) {
      childCopy.options.versions = child.options.versions.filter((version) =>
        availableVersions[child.options?.project]?.map((branchObj) => branchObj['gitBranchName']).includes(version)
      );
      childCopy.children = child.children?.filter(
        (versionedChild) => currentVersion[child.options?.project] === versionedChild.options?.version
      );
      if (childCopy.options?.versions?.length) {
        newChildren.push(childCopy);
      }
    } else {
      // no mutations. can return by reference
      newChildren.push(child);
    }
    return newChildren;
  }, []);

  return res;
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
