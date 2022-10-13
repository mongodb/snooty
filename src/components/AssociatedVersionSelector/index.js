import React, { useMemo, useEffect, useContext, useCallback } from 'react';
import { useTheme, css } from '@emotion/react';
import { navigate } from '@reach/router';
import { VersionContext } from '../../context/version-context';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import Select, { Label } from '../Select';
import { getUILabel, setOptionSlug } from '../VersionDropdown';
import { normalizePath } from '../../utils/normalize-path';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { baseUrl } from '../../utils/base-url';
import { generatePrefix } from '../VersionDropdown/utils';

const buildChoices = (branches) => {
  return branches.map((branch) => ({
    value: branch['gitBranchName'],
    text: getUILabel(branch),
    slug: branch['urlSlug'] || branch['gitBranchName'],
  }));
};

const AssociatedVersionSelector = ({ repoBranches: { siteBasePrefix }, slug }) => {
  const { project, parserBranch } = useSiteMetadata();
  const siteMetadata = useSiteMetadata();
  const { activeVersions, setActiveVersions, availableVersions, showVersionDropdown } = useContext(VersionContext);
  const { screenSize } = useTheme();

  // refer to src/components/VersionDropdown/index.js
  // Attempts to reconcile differences between urlSlug and the parserBranch provided to this component
  // Used to ensure that the context gets updated when user navigates to page via multiple alias urls
  const currentUrlSlug = useMemo(() => {
    if (!availableVersions[project]) {
      return;
    }
    for (let branch of availableVersions[project]) {
      if (branch.gitBranchName === parserBranch) {
        return setOptionSlug(branch);
      }
    }
    return parserBranch;
  }, [parserBranch, availableVersions, project]);

  // refer to src/components/VersionDropdown/index.js
  const getUrl = useCallback(
    (versionTarget) => {
      if (versionTarget === 'legacy') {
        return `${baseUrl()}legacy/?site=${project}`;
      }
      const prefixWithVersion = generatePrefix(versionTarget, siteMetadata, siteBasePrefix);
      return assertTrailingSlash(normalizePath(`${prefixWithVersion}/${slug}`));
    },
    [project, siteBasePrefix, siteMetadata, slug]
  );

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

  const findBranchByGit = useCallback(
    (gitBranchName) => {
      if (!availableVersions[project]) {
        return;
      }

      return availableVersions[project].find((b) => b.gitBranchName === gitBranchName);
    },
    [availableVersions, project]
  );

  const onSelectChange = useCallback(
    ({ value }) => {
      const updatedVersion = {};
      updatedVersion[project] = value;
      setActiveVersions(updatedVersion);

      const targetBranch = findBranchByGit(value);
      if (!targetBranch) {
        console.error(`target branch not found for git branch <${value}>`);
        return;
      }

      const target = targetBranch.alias || targetBranch.urlAliases[0] || targetBranch.gitBranchName;
      const urlTarget = getUrl(target);
      navigate(urlTarget);
    },
    [project, setActiveVersions, findBranchByGit, getUrl]
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
    console.log('current branch');
    console.log(currentBranch);
    console.log('current active versions');
    console.log(activeVersions[project]);
    if (activeVersions[project] !== currentBranch.gitBranchName) {
      const newState = {};
      newState[project] = currentBranch.gitBranchName;
      console.log('update version context');
      console.log(newState);
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
