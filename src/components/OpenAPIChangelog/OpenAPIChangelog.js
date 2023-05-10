import { useState } from 'react';
import styled from '@emotion/styled';
import { H2 } from '@leafygreen-ui/typography';
import Button from '@leafygreen-ui/button';
import FiltersPanel from './components/FiltersPanel';
import ChangeList from './components/ChangeList';
import { mockChangelog, mockDiff } from './data/mockData';
import { ALL_VERSIONS, COMPARE_VERSIONS } from './utils/constants';

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

/* Remove props when useStaticQuery is implemented, this is here for testing purposes */
const OpenAPIChangelog = ({ changelog = mockChangelog, diff = mockDiff }) => {
  const resources = diff.map((d) => d.path);

  const resourceVersions = changelog
    .map((change) => change.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  resourceVersions[0] += ' (latest)';
  const resourceOneDefault = resourceVersions[0];
  const resourceTwoDefault = resourceVersions[1];

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
        resources={resources}
        selectedResource={selectedResources}
        resourceVersions={resourceVersions}
        versionMode={versionMode}
        resourceVersionOne={resourceVersionOne}
        resourceVersionTwo={resourceVersionTwo}
        setSelectedResource={setSelectedResources}
        setVersionMode={setVersionMode}
        setResourceVersionOne={setResourceVersionOne}
        setResourceVersionTwo={setResourceVersionTwo}
      />
      <ChangeList
        versionMode={versionMode}
        changes={versionMode === COMPARE_VERSIONS ? diff : changelog}
        selectedResources={selectedResources}
      />
    </ChangelogPage>
  );
};

export default OpenAPIChangelog;
