import React, { useState, useEffect, useContext, useCallback } from 'react';
import { METADATA_COLLECTION } from '../../build-constants';
import { VersionContext } from '../../context/version-context';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { fetchDocuments } from '../../utils/realm';
import Select, { Label } from '../Select';
import { getUILabel } from '../VersionDropdown';
import { normalizePath } from '../../utils/normalize-path';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { baseUrl } from '../../utils/base-url';
import { generatePrefix } from '../VersionDropdown/utils';
import { navigate } from '@reach/router';

const fetchUmbrellaProject = async (project, dbName) => {
  try {
    const query = {
      'associated_products.name': project,
    };
    const umbrellaProjects = fetchDocuments(dbName, METADATA_COLLECTION, query);
    return umbrellaProjects;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const buildChoices = (branches) => {
  return branches.map((branch) => ({
    value: branch['gitBranchName'],
    text: getUILabel(branch),
    slug: branch['urlSlug'] || branch['gitBranchName'],
  }));
};

const getSlugFromGitBranch = (branches, gitBranchName, siteMetadata, siteBasePrefix, slug) => {
  const branch = branches.find((b) => b.gitBranchName === gitBranchName);
  const targetSlug = branch['urlSlug'] || branch['gitBranchName'];
  if (targetSlug === 'legacy') {
    return `${baseUrl()}legacy/?site=${siteMetadata.project}`;
  }
  const prefixWithVersion = generatePrefix(targetSlug, siteMetadata, siteBasePrefix);
  return assertTrailingSlash(normalizePath(`${prefixWithVersion}/${slug}`));
};

const AssociatedVersionSelector = ({ repoBranches: { siteBasePrefix }, slug }) => {
  const { project, database, isAssociatedProduct } = useSiteMetadata();
  const siteMetadata = useSiteMetadata();
  const [versions, setVersions] = useState([]);
  const { activeVersions, setActiveVersions, availableVersions } = useContext(VersionContext);
  // use activeversion to signal in select dropdown

  const updateSelection = useCallback(
    ({ value }) => {
      const updatedVersion = {};
      updatedVersion[project] = value;
      setActiveVersions(updatedVersion);
      // NEED TO NAVIGATE TO SAID VALUE
      // note. version context is stored by gitBranchName
      const targetSlug = getSlugFromGitBranch(versions, value, siteMetadata, siteBasePrefix, slug);
      navigate(targetSlug);
    },
    [project, setActiveVersions, versions, siteMetadata, siteBasePrefix, slug]
  );

  useEffect(() => {
    // find if current project is an associated project
    // only required on init
    if (!availableVersions[project]) {
      return;
    }

    fetchUmbrellaProject(project, database)
      .then((umbrellaProjects) => {
        if (umbrellaProjects.length > 0) {
          setVersions(availableVersions[project]);
        }
      })
      .catch((e) => {
        if (isAssociatedProduct) {
          setVersions(availableVersions[project]);
        }
      })
      .finally(() => {
        // if version is not specified in url, set to most recent local storage
        // if set, ignore logic and route to desired target
      });
  }, [project, database, setVersions, activeVersions, availableVersions, isAssociatedProduct]);

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
