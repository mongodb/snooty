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

const MOCK_RESOURCE_VERSIONS = ['2020-01-01'];

const OpenAPIChangelog = () => {
  const [versionMode, setVersionMode] = useState(ALL_VERSIONS);
  const [selectedResource, setSelectedResource] = useState('All');
  const [resourceVersions, setResourceVersions] = useState(MOCK_RESOURCE_VERSIONS);
  const [resourceVersionOne, setResourceVersionOne] = useState('');
  const [resourceVersionTwo, setResourceVersionTwo] = useState('');

  function handleVersionModeChange(value) {
    setVersionMode(value);
  }

  return (
    <ChangelogPage>
      <ChangelogHeader>
        <H2>API Changelog</H2>
        <Button>Download API Changelog</Button>
      </ChangelogHeader>
      <FiltersPanel
        resourceVersions={resourceVersions}
        versionMode={versionMode}
        handleVersionModeChange={handleVersionModeChange}
      />
      <ChangeList />
    </ChangelogPage>
  );
};

export default OpenAPIChangelog;
