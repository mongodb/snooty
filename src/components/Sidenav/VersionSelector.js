import React, { useContext, useEffect, useState } from 'react';
// import { navigate } from '@reach/router';
import Select from '../Select';
import { VersionContext } from '../../context/version-context';
import styled from '@emotion/styled';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { theme } from '../../theme/docsTheme';

const buildChoice = (branch) => {
  return {
    text: branch.urlSlug || branch.gitBranchName,
    value: branch.gitBranchName,
  };
};

const buildChoices = (branches) => {
  return branches.map(buildChoice);
};

const StyledSelect = styled(Select)`
  flex: 1 0 auto;

  > div:nth-of-type(2) {
    min-width: 150px;
    width: max-content;
  }

  > button {
    z-index: 3;
    height: ${theme.size.medium};

    ul {
      min-width: 200px;
    }
  }
`;

const VersionSelector = ({ versionedProject = '' }) => {
  // verify if this version selector is for current product
  // determines if we should use reach router or not
  // ie. on atlas-cli  v1.3 , switch to v1.0 -> should update link (what if link is 404)
  const { activeVersions, setActiveVersions, availableVersions } = useContext(VersionContext);
  const { project } = useSiteMetadata();

  const [options, setOptions] = useState(buildChoices(availableVersions[versionedProject]));

  useEffect(() => {
    // TODO: verify options differ from ToC of umbrella vs associated product
    // via difference of snooty.toml[associated_products] vs pool.repo_branches
    setOptions(buildChoices(availableVersions[versionedProject]));
  }, [availableVersions, versionedProject]);

  const navigateToVersion = (gitBranchName) => {
    const branch = availableVersions[versionedProject].find((branch) => branch['gitBranchName' === gitBranchName]);
    const slug = branch?.slug;
    if (slug) {
      console.log('navigating to slug ', slug);
    }
  };

  const onChange = ({ value }) => {
    const newState = {};
    newState[versionedProject] = value;
    setActiveVersions(newState);
    // if navigating from within associated product itself, navigate to versioned doc
    if (project === versionedProject) {
      navigateToVersion(value);
    }
  };

  return (
    <StyledSelect
      value={activeVersions[versionedProject]}
      onChange={onChange}
      aria-labelledby={'select'}
      popoverZIndex={2}
      allowDeselect={false}
      choices={options}
    ></StyledSelect>
  );
};

export default VersionSelector;
