//nested filtering out all changes with hideFromChangelog
//hides changes on all versions changelog
const hideChanges = (changelog) => {
  const versionUpdate = (version) => {
    const updatedVersion = { ...version };
    if (version?.changes) {
      updatedVersion.changes = version.changes.filter((change) => !change.hideFromChangelog);
    }
    return updatedVersion;
  };

  //pathUpdate takes the array of versions from the specific path passed in and takes each version and runs versionUpdate on it
  const pathUpdate = (path) => {
    const updatedPath = { ...path, versions: path.versions.map(versionUpdate) };
    updatedPath.versions = updatedPath.versions.filter((version) => version.changes?.length);
    return updatedPath;
  };

  //dateUpdate takes the array of paths from the specific date section passed in and takes each path and runs pathUpdate on it
  const dateUpdate = (dateSection) => {
    const updatedDateSection = { ...dateSection, paths: dateSection.paths.map(pathUpdate) };
    updatedDateSection.paths = updatedDateSection.paths.filter((path) => path.versions?.length);
    return updatedDateSection;
  };

  //changelog is the json file with everything in it. Map at this level takes each date section and runs dateUpdate on it
  const updatedChangelog = changelog.map(dateUpdate);
  return updatedChangelog.filter((dateSection) => dateSection.paths?.length);
};

//nested filtering out all changes with hideFromChangelog
//hides changes on diffs
const hideDiffChanges = (diffData) => {
  const pathUpdate = (path) => {
    const updatedPath = { ...path };
    if (path?.changes) {
      updatedPath.changes = path.changes.filter((change) => !change.hideFromChangelog);
    }
    return updatedPath;
  };

  const updatedDiffData = diffData.map(pathUpdate);
  return updatedDiffData.filter((path) => path.changes?.length);
};

module.exports = { hideChanges, hideDiffChanges };
