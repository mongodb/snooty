import { useState } from 'react';
import styled from '@emotion/styled';
import { H2 } from '@leafygreen-ui/typography';
import Button from '@leafygreen-ui/button';
import FiltersPanel from './components/FiltersPanel';
import ChangeList from './components/ChangeList';
import { mockChangelog, mockDiff } from './data/mockData';
import { ALL_VERSIONS } from './utils/constants';

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
  'GET .../v1.0/groups/{groupId}/clusters/{clusterName}/backup/tenant/restore',
  'GET .../v1.0/groups/{groupId}/clusters/{clusterName}/backup/tenant/before',
];

/* Remove props when useStaticQuery is implemented, this is here for testing purposes */
const OpenAPIChangelog = ({ changelog = mockChangelog, diff = mockDiff }) => {
  const resourceOneDefault = MOCK_RESOURCE_VERSIONS[0];
  const resourceTwoDefault = MOCK_RESOURCE_VERSIONS[1];

  const [versionMode, setVersionMode] = useState(ALL_VERSIONS);
  const [selectedResources, setSelectedResources] = useState([]);
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
        selectedResource={selectedResources}
        resourceVersions={MOCK_RESOURCE_VERSIONS}
        versionMode={versionMode}
        resourceVersionOne={resourceVersionOne}
        resourceVersionTwo={resourceVersionTwo}
        setSelectedResource={setSelectedResources}
        setVersionMode={setVersionMode}
        setResourceVersionOne={setResourceVersionOne}
        setResourceVersionTwo={setResourceVersionTwo}
      />
      <ChangeList versionMode={versionMode} changes={versionMode === ALL_VERSIONS ? diff : changelog} />
    </ChangelogPage>
  );
};

export default OpenAPIChangelog;
