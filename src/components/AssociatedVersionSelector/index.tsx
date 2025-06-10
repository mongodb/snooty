import React, { useContext, useCallback } from 'react';
import styled from '@emotion/styled';
import { VersionContext } from '../../context/version-context';
import Select, { Label } from '../Select';
import { getUILabel } from '../VersionDropdown';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { theme } from '../../theme/docsTheme';

type ThemeType = typeof theme;

declare module '@emotion/react' {
  export interface Theme extends ThemeType {}
}

type Branch = {
  gitBranchName: string;
  [key: string]: any;
};

type Choice = {
  value: string;
  text: string;
};

interface SelectChangeEvent {
  value: string;
}

interface VersionContextType {
  activeVersions: Record<string, string>;
  availableVersions: Record<string, Branch[]>;
  hasEmbeddedVersionDropdown: boolean;
  onVersionSelect: (project: string, version: string) => void;
}

const buildChoices = (branches: Branch[]): Choice[] => {
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

const AssociatedVersionSelector: React.FC = () => {
  const { project } = useSnootyMetadata() as { project: string };
  const { activeVersions, availableVersions, hasEmbeddedVersionDropdown, onVersionSelect } = useContext(
    VersionContext
  ) as VersionContextType;

  const onSelectChange = useCallback(
    ({ value }: SelectChangeEvent) => {
      onVersionSelect(project, value);
    },
    [onVersionSelect, project]
  );

  return (
    <>
      {hasEmbeddedVersionDropdown &&
        activeVersions[project] &&
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
