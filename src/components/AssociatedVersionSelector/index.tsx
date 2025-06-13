import React, { useContext, useCallback } from 'react';
import { css } from '@leafygreen-ui/emotion';
import { VersionContext } from '../../context/version-context';
import Select, { Label } from '../Select';
import { getUILabel } from '../VersionDropdown';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { theme } from '../../theme/docsTheme';
import { BranchData } from '../../types/data';

interface SelectChangeEvent {
  value: string;
}

const StyledSelect = css`
  width: 100%;

  button[aria-expanded='true'] {
    svg {
      transform: rotate(180deg);
    }
  }

  @media ${theme.screenSize.smallAndUp} {
    /* Min width of right panel */
    max-width: 180px;
  }
`;

const AssociatedVersionSelector = () => {
  const { project } = useSnootyMetadata() as { project: string };
  const { activeVersions, availableVersions, hasEmbeddedVersionDropdown, onVersionSelect } = useContext(VersionContext);

  const onSelectChange = useCallback(
    ({ value }: SelectChangeEvent) => {
      onVersionSelect(project, value);
    },
    [onVersionSelect, project]
  );

  const currentVersions: BranchData[] = availableVersions[project] ?? [];

  return (
    <>
      {hasEmbeddedVersionDropdown && !!activeVersions[project] && currentVersions.length > 0 && (
        <>
          <Label>Specify your version</Label>
          <Select
            className={StyledSelect}
            choices={currentVersions.map((branch) => ({
              value: branch.gitBranchName,
              text: getUILabel(branch),
            }))}
            value={activeVersions[project]}
            onChange={onSelectChange}
          />
        </>
      )}
    </>
  );
};

export default AssociatedVersionSelector;
