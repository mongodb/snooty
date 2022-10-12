import React, { useState, useEffect, useContext, useCallback } from 'react';
import { METADATA_COLLECTION } from '../../build-constants';
import { VersionContext } from '../../context/version-context';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { useUrlSlug } from '../../hooks/use-url-slug';
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

const getBranchFromSlug = (slug, branches) => branches.find((branch) => branch.urlSlug === slug);

const AssociatedVersionSelector = ({ repoBranches: { branches, siteBasePrefix }, slug, isAssociatedProduct }) => {
  const { project, database } = useSiteMetadata();
  const siteMetadata = useSiteMetadata();
  const [versions, setVersions] = useState([]);
  const { activeVersions, setActiveVersions, availableVersions } = useContext(VersionContext);
  const { currentUrlSlug } = useUrlSlug(branches);

  const updateSelection = useCallback(
    ({ value }) => {
      const updatedVersion = {};
      updatedVersion[project] = value;
      setActiveVersions(updatedVersion);
      const targetSlug = getSlugFromGitBranch(versions, value, siteMetadata, siteBasePrefix, slug);
      navigate(targetSlug);
    },
    [project, setActiveVersions, versions, siteMetadata, siteBasePrefix, slug]
  );

  useEffect(() => {
    // find if current project is an associated project
    // only required on init
    if (!availableVersions[project] || !isAssociatedProduct) {
      return;
    }

    fetchUmbrellaProject(project, database)
      .then((umbrellaProjects) => {
        // call setActiveVersions if not matched with current version
        const branch = getBranchFromSlug(currentUrlSlug, availableVersions[project]);
        if (branch && branch.gitBranchName !== activeVersions[project]) {
          const newVersionState = {};
          newVersionState[project] = branch.gitBranchName;
          setActiveVersions(newVersionState);
        }
        if (umbrellaProjects.length > 0) {
          setVersions(availableVersions[project]);
        }
      })
      .catch((e) => {
        setVersions(availableVersions[project]);
      });
  }, [
    project,
    database,
    setVersions,
    activeVersions,
    availableVersions,
    isAssociatedProduct,
    currentUrlSlug,
    setActiveVersions,
  ]);

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
