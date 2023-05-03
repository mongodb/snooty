import React from 'react';
import styled from '@emotion/styled';
import { COMPARE_VERSIONS } from '../constants';
import VersionModeSegmentedControl from './VersionModeSegmentedControl';
import ResourceSelect from './ResourceSelect';
import DiffSelect from './DiffSelect';

const Wrapper = styled.div`
  width: 100%;
  margin-top: 32px;
`;

const FiltersPanel = ({
  versionMode,
  handleVersionModeChange,
  resourceVersions,
  selectedResource,
  resources,
  handleSelectedResourceChange,
  resourceVersionOne,
  resourceVersionTwo,
  handleResourceVersionOneChange,
  handleResourceVersionTwoChange,
}) => {
  return (
    <Wrapper>
      <VersionModeSegmentedControl versionMode={versionMode} handleChange={handleVersionModeChange} />
      {versionMode === COMPARE_VERSIONS ? (
        <DiffSelect
          resourceVersionOne={resourceVersionOne}
          resourceVersionTwo={resourceVersionTwo}
          resourceVersions={resourceVersions}
          handleVersionOneChange={handleResourceVersionOneChange}
          handleVersionTwoChange={handleResourceVersionTwoChange}
        />
      ) : null}
      <ResourceSelect
        resources={resources}
        selectedResource={selectedResource}
        handleChange={handleSelectedResourceChange}
      />
    </Wrapper>
  );
};

export default FiltersPanel;
