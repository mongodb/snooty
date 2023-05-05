import React from 'react';
import styled from '@emotion/styled';
import VersionModeSegmentedControl from './VersionModeSegmentedControl';
import ResourceSelect from './ResourceSelect';
import DiffSelect from './DiffSelect';

const Wrapper = styled.div`
  width: 100%;
  margin-top: 32px;
`;

const FiltersPanel = ({
  isVersionCompare,
  resourceVersions,
  selectedResource,
  resources,
  resourceVersionOne,
  resourceVersionTwo,
  setSelectedResource,
  setIsVersionCompare,
  setResourceVersionOne,
  setResourceVersionTwo,
}) => {
  return (
    <Wrapper>
      <VersionModeSegmentedControl isVersionCompare={isVersionCompare} handleChange={setIsVersionCompare} />
      {isVersionCompare && (
        <DiffSelect
          resourceVersionOne={resourceVersionOne}
          resourceVersionTwo={resourceVersionTwo}
          resourceVersions={resourceVersions}
          handleVersionOneChange={setResourceVersionOne}
          handleVersionTwoChange={setResourceVersionTwo}
        />
      )}
      <ResourceSelect
        resources={resources}
        selectedResource={selectedResource}
        handleChange={(value) => setSelectedResource(value)}
      />
    </Wrapper>
  );
};

export default FiltersPanel;
