import styled from '@emotion/styled';
import { H2 } from '@leafygreen-ui/typography';
import { useState } from 'react';
import Button from '@leafygreen-ui/button';
import FiltersPanel from './FiltersPanel';
import ChangeList from './ChangeList';
import { ALL_VERSIONS } from './FiltersPanel/constants';

const ChangelogPage = styled.div`
  width: 100%;
  margin-top: 60px;
  padding-left: 64px;
  padding-right: 64px;
`;

const ChangelogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MOCK_RESOURCE_VERSIONS = ['2023-01-01 (latest)', '2022-01-01', '2021-01-01', '2020-01-01'];
const MOCK_RESOURCES = [
  'All',
  'GET .../v1.0/groups/{groupId}/clusters/{clusterName}/backup/tenant/restore',
  'GET .../v1.0/groups/{groupId}/clusters/{clusterName}/backup/tenant/before',
];

const OpenAPIChangelog = () => {
  const resourceOneDefault = MOCK_RESOURCE_VERSIONS[0];
  const resourceTwoDefault = MOCK_RESOURCE_VERSIONS[1];

  const [versionMode, setVersionMode] = useState(ALL_VERSIONS);
  const [selectedResource, setSelectedResource] = useState('All');
  const [resourceVersionOne, setResourceVersionOne] = useState(resourceOneDefault);
  const [resourceVersionTwo, setResourceVersionTwo] = useState(resourceTwoDefault);

  function handleVersionModeChange(value) {
    setVersionMode(value);
  }

  function handleSelectedResourceChange(value) {
    setSelectedResource(value);
  }

  function handleResourceVersionOneChange(value) {
    setResourceVersionOne(value);
  }

  function handleResourceVersionTwoChange(value) {
    setResourceVersionTwo(value);
  }

  return (
    <ChangelogPage>
      <ChangelogHeader>
        <H2>API Changelog</H2>
        <Button>Download API Changelog</Button>
      </ChangelogHeader>
      <FiltersPanel
        handleSelectedResourceChange={handleSelectedResourceChange}
        resources={MOCK_RESOURCES}
        selectedResource={selectedResource}
        resourceVersions={MOCK_RESOURCE_VERSIONS}
        versionMode={versionMode}
        handleVersionModeChange={handleVersionModeChange}
        resourceVersionOne={resourceVersionOne}
        resourceVersionTwo={resourceVersionTwo}
        handleResourceVersionOneChange={handleResourceVersionOneChange}
        handleResourceVersionTwoChange={handleResourceVersionTwoChange}
      />
      <ChangeList />
    </ChangelogPage>
  );
};

export default OpenAPIChangelog;
