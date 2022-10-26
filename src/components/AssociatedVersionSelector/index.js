import React, { useContext, useCallback } from 'react';
import { useTheme, css } from '@emotion/react';
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

const AssociatedVersionSelector = () => {
  const { project } = useSiteMetadata();
  const { activeVersions, availableVersions, showVersionDropdown, onVersionSelect } = useContext(VersionContext);
  const { screenSize } = useTheme();

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
