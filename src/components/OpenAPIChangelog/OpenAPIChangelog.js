import styled from '@emotion/styled';
import { H2 } from '@leafygreen-ui/typography';
import { useState } from 'react';
import Button from '@leafygreen-ui/button';
import FiltersPanel from './FiltersPanel';
import ChangeList from './ChangeList';

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

export const MOCK_RESOURCE_VERSIONS = ['2023-01-01 (latest)', '2022-01-01', '2021-01-01', '2020-01-01'];
export const MOCK_RESOURCES = [
  'All',
  'GET .../v1.0/groups/{groupId}/clusters/{clusterName}/backup/tenant/restore',
  'GET .../v1.0/groups/{groupId}/clusters/{clusterName}/backup/tenant/before',
];

const OpenAPIChangelog = () => {
  const resourceOneDefault = MOCK_RESOURCE_VERSIONS[0];
  const resourceTwoDefault = MOCK_RESOURCE_VERSIONS[1];

  const [isVersionCompare, setIsVersionCompare] = useState(false);
  const [selectedResource, setSelectedResource] = useState('All');
  const [resourceVersionOne, setResourceVersionOne] = useState(resourceOneDefault);
  const [resourceVersionTwo, setResourceVersionTwo] = useState(resourceTwoDefault);

  return (
    <ChangelogPage>
      <ChangelogHeader>
        <H2>API Changelog</H2>
        <Button>Download API Changelog</Button>
      </ChangelogHeader>
      <FiltersPanel
        resources={MOCK_RESOURCES}
        selectedResource={selectedResource}
        resourceVersions={MOCK_RESOURCE_VERSIONS}
        isVersionCompare={isVersionCompare}
        resourceVersionOne={resourceVersionOne}
        resourceVersionTwo={resourceVersionTwo}
        setSelectedResource={setSelectedResource}
        setIsVersionCompare={setIsVersionCompare}
        setResourceVersionOne={setResourceVersionOne}
        setResourceVersionTwo={setResourceVersionTwo}
      />
      <ChangeList />
    </ChangelogPage>
  );
};

export default OpenAPIChangelog;
