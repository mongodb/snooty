import React, { useEffect, useContext, useCallback } from 'react';
import { useTheme, css } from '@emotion/react';
import { navigate } from '@reach/router';
import { VersionContext } from '../../context/version-context';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import Select, { Label } from '../Select';
import { getUILabel } from '../VersionDropdown';
import { useCurrentUrlSlug } from '../../hooks/use-current-url-slug';
import { getUrl } from '../../utils/url-utils';

const buildChoices = (branches) => {
  return branches.map((branch) => ({
    value: branch['gitBranchName'],
    text: getUILabel(branch),
  }));
};

const findBranchByGit = (gitBranchName, branches) => {
  if (!branches || !branches.length) {
    return;
  }

  return branches.find((b) => b.gitBranchName === gitBranchName);
};

const AssociatedVersionSelector = ({ repoBranches: { siteBasePrefix }, slug }) => {
  const { project, parserBranch } = useSiteMetadata();
  const siteMetadata = useSiteMetadata();
  const { activeVersions, setActiveVersions, availableVersions, showVersionDropdown } = useContext(VersionContext);
  const { screenSize } = useTheme();
  const currentUrlSlug = useCurrentUrlSlug(parserBranch, availableVersions[project]);

  // attempts to find branch by given url alias. can be alias, urlAliases, or gitBranchName
  const findBranchByAlias = useCallback(
    (alias) => {
      if (!availableVersions[project]) {
        return;
      }

      return availableVersions[project].find(
        (b) => b.urlSlug === alias || b.urlAliases.includes(alias) || b.gitBranchName === alias
      );
    },
    [availableVersions, project]
  );

  const onSelectChange = useCallback(
    ({ value }) => {
      const updatedVersion = {};
      updatedVersion[project] = value;
      setActiveVersions(updatedVersion);

      const targetBranch = findBranchByGit(value, availableVersions[project]);
      if (!targetBranch) {
        console.error(`target branch not found for git branch <${value}>`);
        return;
      }

      const target = targetBranch.urlSlug || targetBranch.urlAliases[0] || targetBranch.gitBranchName;
      const urlTarget = getUrl(target, project, siteMetadata, siteBasePrefix);
      navigate(urlTarget);
    },
    [project, siteMetadata, siteBasePrefix, setActiveVersions, availableVersions]
  );

  useEffect(() => {
    // if current version differs from browser storage version
    // update browser local storage
    if (!currentUrlSlug) {
      return;
    }
    const currentBranch = findBranchByAlias(currentUrlSlug);
    if (!currentBranch) {
      console.error(`url <${currentUrlSlug}> does not correspond to any current branch`);
      return;
    }
    if (activeVersions[project] !== currentBranch.gitBranchName) {
      const newState = {};
      newState[project] = currentBranch.gitBranchName;
      setActiveVersions(newState);
    }
  }, [activeVersions, availableVersions, currentUrlSlug, findBranchByAlias, project, setActiveVersions]);

  return (
    <>
      {process.env.GATSBY_TEST_EMBED_VERSIONS &&
        showVersionDropdown &&
        availableVersions[project] &&
        availableVersions[project].length > 0 && (
          <>
            <Label>Specify your version</Label>
            <Select
              css={css`
                width: 100%;

                @media ${screenSize.smallAndUp} {
                  /* Min width of right panel */
                  max-width: 180px;
                }
              `}
              choices={buildChoices(availableVersions[project])}
              value={activeVersions[project]}
              onChange={onSelectChange}
            ></Select>
          </>
        )}
    </>
  );
};

export default AssociatedVersionSelector;
