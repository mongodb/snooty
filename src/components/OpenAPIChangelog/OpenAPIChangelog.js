import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { H2 } from '@leafygreen-ui/typography';
import Button from '@leafygreen-ui/button';
import FiltersPanel from './components/FiltersPanel';
import ChangeList from './components/ChangeList';
import { mockChangelog, mockDiff } from './data/mockData';

const ChangelogPage = styled.div`
  width: 100%;
  margin-top: 60px;
`;

const ChangelogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/* Remove props when useStaticQuery is implemented, this is here for testing purposes */
const OpenAPIChangelog = ({ changelog = mockChangelog, diff = mockDiff }) => {
  const [versionMode, setVersionMode] = useState(false);

  const [filteredDiff, setFilteredDiff] = useState(diff);
  const [filteredChangelog, setFilteredChangelog] = useState(changelog);

  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    if (!selectedFilters.length) {
      setFilteredDiff(diff);
    } else setFilteredDiff(diff.filter(({ httpMethod, path }) => selectedFilters.includes(`${httpMethod} ${path}`)));
  }, [selectedFilters, diff]);

  useEffect(() => {
    if (!selectedFilters.length) {
      setFilteredChangelog(changelog);
    } else {
      const filteredReleases = changelog.filter((release) => {
        return (
          release.paths.filter(({ httpMethod, path }) => selectedFilters.includes(`${httpMethod} ${path}`)).length !== 0
        );
      });
      const filteredResources = filteredReleases.map((release) => {
        return {
          ...release,
          paths: release.paths.filter(({ httpMethod, path }) => selectedFilters.includes(`${httpMethod} ${path}`)),
        };
      });
      setFilteredChangelog(filteredResources);
    }
  }, [selectedFilters, changelog]);

  const changeFilter = (resource, e) => {
    if (e?.target?.checked === true) {
      setSelectedFilters([...selectedFilters, resource]);
    } else {
      setSelectedFilters(selectedFilters.filter((rs) => rs !== resource));
    }
  };

  return (
    <ChangelogPage>
      <ChangelogHeader>
        <H2>API Changelog</H2>
        <Button>Download API Changelog</Button>
      </ChangelogHeader>

      {/* Placeholder for now to switch between views of list */}
      <input type="radio" id="all-versions" checked={!versionMode} onChange={() => setVersionMode(false)} />
      <label for="all-versions"> All Versions</label>
      <br />
      <input type="radio" id="compare-two" checked={versionMode} onChange={() => setVersionMode(true)} />
      <label for="compare-two"> Compare Two Versions</label>

      <div></div>

      {/* Placeholder for now to filter a bit */}
      <input
        type="checkbox"
        id="filter-1"
        onChange={(e) => changeFilter('POST /api/atlas/v2/groups/{groupId}/accessList', e)}
      />
      <label for="filter-1"> {'POST /api/atlas/v2/groups/{groupId}/accessList'}</label>
      <br />
      <input
        type="checkbox"
        id="filter-2"
        onChange={(e) => changeFilter('PUT /api/atlas/v2/groups/{groupId}/alertConfigs/{alertConfigId}', e)}
      />
      <label for="filter-2"> {'PUT /api/atlas/v2/groups/{groupId}/alertConfigs/{alertConfigId}'}</label>

      <FiltersPanel />
      <ChangeList versionMode={versionMode} changes={versionMode ? filteredDiff : filteredChangelog} />
    </ChangelogPage>
  );
};

export default OpenAPIChangelog;
