import { useState } from 'react';
import styled from '@emotion/styled';
import { H2 } from '@leafygreen-ui/typography';
import Button from '@leafygreen-ui/button';
import useChangelogData from '../../utils/use-changelog-data';
import FiltersPanel from './components/FiltersPanel';
import ChangeList from './components/ChangeList';
import { mockDiff } from './data/mockData';
import { ALL_VERSIONS, COMPARE_VERSIONS } from './utils/constants';

const ChangelogPage = styled.div`
  width: 100%;
  margin-top: 60px;
`;

const ChangelogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 26px;
    color: lightgray;
  }
`;

const OpenAPIChangelog = ({ diff = mockDiff }) => {
  const { changelog, index } = useChangelogData();
  // TODO: Replace with full list of resources
  const resources = diff.map((d) => `${d.httpMethod} ${d.path}`);
  const resourceVersions = index.versions?.length ? index.versions.slice().reverse() : [];
  resourceVersions[0] += ' (latest)';

  const [versionMode, setVersionMode] = useState(ALL_VERSIONS);
  const [selectedResources, setSelectedResources] = useState([]);
  const [resourceVersionOne, setResourceVersionOne] = useState();
  const [resourceVersionTwo, setResourceVersionTwo] = useState();

  return (
    <ChangelogPage>
      <ChangelogHeader>
        <H2>API Changelog 2.0{!!index.specRevisionShort && `~${index.specRevisionShort}`}</H2>
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
      {(versionMode === ALL_VERSIONS || (resourceVersionOne && resourceVersionTwo)) && (
        <ChangeList
          versionMode={versionMode}
          changes={versionMode === COMPARE_VERSIONS ? diff : changelog}
          selectedResources={selectedResources}
        />
      )}
    </ChangelogPage>
  );
};

export default OpenAPIChangelog;
