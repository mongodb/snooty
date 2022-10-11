import React, { useState, useEffect, useContext, useCallback } from 'react';
import { METADATA_COLLECTION } from '../../build-constants';
import { VersionContext } from '../../context/version-context';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { fetchDocuments } from '../../utils/realm';
import Select, { Label } from '../Select';

const fetchUmbrellaProject = async (project, dbName, backupResponse) => {
  try {
    const query = {
      'associated_products.name': project,
    };
    const umbrellaProjects = fetchDocuments(dbName, METADATA_COLLECTION, query);
    return umbrellaProjects;
  } catch (e) {
    console.error(e);
    return backupResponse;
    // on error, fall back to build time
  }
};

const buildChoices = (branches) => {
  return branches.map((branch) => ({
    value: branch.gitBranchName,
    text: branch.versionSelectorLabel,
  }));
};

const AssociatedVersionSelector = () => {
  const { project, database, umbrellaProjects } = useSiteMetadata();
  const [versions, setVersions] = useState([]);
  const { activeVersions, setActiveVersions, availableVersions } = useContext(VersionContext);
  // use activeversion to signal in select dropdown

  const updateSelection = useCallback(
    ({ value }) => {
      const updatedVersion = {};
      updatedVersion[project] = value;
      setActiveVersions(updatedVersion);
    },
    [project, setActiveVersions]
  );

  useEffect(() => {
    // find if current project is an associated project
    // only required on init
    if (!availableVersions[project]) {
      return;
    }

    fetchUmbrellaProject(project, database, umbrellaProjects).then((umbrellaProjects) => {
      if (umbrellaProjects.length > 0) {
        setVersions(availableVersions[project]);
      }
    });
  }, [project, database, setVersions, availableVersions, umbrellaProjects]);

  return (
    <>
      {versions.length > 0 && (
        <>
          <Label>Specify your version</Label>
          <Select choices={buildChoices(versions)} value={activeVersions[project]} onChange={updateSelection}></Select>
        </>
      )}
    </>
  );
};

export default AssociatedVersionSelector;
