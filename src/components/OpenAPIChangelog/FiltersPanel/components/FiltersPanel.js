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
  resourceVersions,
  selectedResource,
  resources,
  resourceVersionOne,
  resourceVersionTwo,
  setSelectedResource,
  setVersionMode,
  setResourceVersionOne,
  setResourceVersionTwo,
}) => {
  return (
    <Wrapper>
      <VersionModeSegmentedControl versionMode={versionMode} handleChange={(value) => setVersionMode(value)} />
      {versionMode === COMPARE_VERSIONS ? (
        <DiffSelect
          resourceVersionOne={resourceVersionOne}
          resourceVersionTwo={resourceVersionTwo}
          resourceVersions={resourceVersions}
          handleVersionOneChange={(value) => setResourceVersionOne(value)}
          handleVersionTwoChange={(value) => setResourceVersionTwo(value)}
        />
      ) : null}
      <ResourceSelect
        resources={resources}
        selectedResource={selectedResource}
        handleChange={(value) => setSelectedResource(value)}
      />
    </Wrapper>
  );
};

export default FiltersPanel;
