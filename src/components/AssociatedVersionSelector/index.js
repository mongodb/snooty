import React, { useContext, useCallback } from 'react';
import styled from '@emotion/styled';
import { VersionContext } from '../../context/version-context';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import Select, { Label } from '../Select';
import { getUILabel } from '../VersionDropdown';

const buildChoices = (branches) => {
  return branches.map((branch) => ({
    value: branch['gitBranchName'],
    text: getUILabel(branch),
  }));
};

const StyledSelect = styled(Select)`
  width: 100%;

  button[aria-expanded='true'] {
    svg {
      transform: rotate(180deg);
    }
  }

  @media ${({ theme }) => theme.screenSize.smallAndUp} {
    /* Min width of right panel */
    max-width: 180px;
  }
`;

const AssociatedVersionSelector = () => {
  const { project } = useSiteMetadata();
  const { activeVersions, availableVersions, showVersionDropdown, onVersionSelect } = useContext(VersionContext);
  // const { screenSize } = useTheme();

  const onSelectChange = useCallback(
    ({ value }) => {
      onVersionSelect(project, value);
    },
    [onVersionSelect, project]
  );

  return (
    <>
      {process.env.GATSBY_TEST_EMBED_VERSIONS &&
        showVersionDropdown &&
        availableVersions[project] &&
        availableVersions[project].length > 0 && (
          <>
            <Label>Specify your version</Label>
            <StyledSelect
              choices={buildChoices(availableVersions[project])}
              value={activeVersions[project]}
              onChange={onSelectChange}
            ></StyledSelect>
          </>
        )}
    </>
  );
};

export default AssociatedVersionSelector;
