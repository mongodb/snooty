import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { H2 } from '@leafygreen-ui/typography';
import Button from '@leafygreen-ui/button';
import FiltersPanel from './components/FiltersPanel';
import ChangeList from './components/ChangeList';
import { mockChangelog, mockDiff, mockIndex } from './data/mockData';
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

/* Remove props when useStaticQuery is implemented, this is here for testing purposes */
const OpenAPIChangelog = ({ changelog = mockChangelog, diff = mockDiff, index = mockIndex }) => {
  // TODO: Replace with full list of resources
  const resources = diff.map((d) => `${d.httpMethod} ${d.path}`);
  const resourceVersions = index.versions?.length ? index.versions.slice().reverse() : [];
  resourceVersions[0] += ' (latest)';

  const [versionMode, setVersionMode] = useState(ALL_VERSIONS);
  const [selectedResources, setSelectedResources] = useState([]);
  const [resourceVersionOne, setResourceVersionOne] = useState();
  const [resourceVersionTwo, setResourceVersionTwo] = useState();

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
        <H2>API Changelog 2.0{!!index.specRevisionShort && `~${index.specRevisionShort}`}</H2>
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
          changes={versionMode === COMPARE_VERSIONS ? filteredDiff : filteredChangelog}
          selectedResources={selectedResources}
        />
      )}
    </ChangelogPage>
  );
};

export default OpenAPIChangelog;
