import React, { useContext, useEffect, useState } from 'react';
// import { navigate } from '@reach/router';
import { Select, Option } from '@leafygreen-ui/select';
import { VersionContext } from '../../context/version-context';
import styled from '@emotion/styled';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { cx, css } from '@leafygreen-ui/emotion';
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

  > button {
    height: ${theme.size.medium};
  }
`;

const menuStyling = css`
  > div {
    min-width: 200px;
    width: fit-content;
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
    setOptions(buildChoices(availableVersions[versionedProject]));
  }, [availableVersions, versionedProject]);

  const navigateToVersion = (gitBranchName) => {
    const branch = availableVersions[versionedProject].find((branch) => branch['gitBranchName' === gitBranchName]);
    const slug = branch?.slug;
    if (slug) {
      console.log('navigating to slug ', slug);
      // TODO: get url logic from DOP-3266
    }
    // navigate()
  };

  const onChange = (value) => {
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
      portalClassName={cx(menuStyling)}
      value={activeVersions[versionedProject]}
      onChange={onChange}
      aria-labelledby={'select'}
      popoverZIndex={2}
      allowDeselect={false}
    >
      {options.map((choice) => (
        <Option key={choice.value} value={choice.value} role="option">
          {choice.text}
        </Option>
      ))}
    </StyledSelect>
  );
};

export default VersionSelector;
