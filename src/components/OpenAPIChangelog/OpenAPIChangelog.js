import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { Body, H2 } from '@leafygreen-ui/typography';
import Button from '@leafygreen-ui/button';
import { theme } from '../../theme/docsTheme';
import useChangelogData from '../../utils/use-changelog-data';
import FiltersPanel from './components/FiltersPanel';
import ChangeList from './components/ChangeList';
import { mockDiff } from './data/mockData';
import { ALL_VERSIONS, getDownloadChangelogUrl } from './utils/constants';
import getDiffResourcesList from './utils/getDiffResourcesList';

const ChangelogPage = styled.div`
  width: 100%;
  margin-top: 60px;
`;

const ChangelogHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 26px;
    color: lightgray;
  }

  @media ${theme.screenSize.upToSmall} {
    flex-direction: column;
    align-items: start;
    gap: 24px;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: end;
  gap: 10px;

  p {
    color: ${palette.gray.dark1};
  }

  @media ${theme.screenSize.upToMedium} {
    flex-direction: column;
    align-items: start;
    gap: 0;
  }
`;

const DownloadButton = styled(Button)`
  min-width: 182px;
`;

const OpenAPIChangelog = ({ diff = mockDiff }) => {
  const { index = {}, changelog = [], changelogResourcesList = [] } = useChangelogData();
  const resourceVersions = index.versions?.length ? index.versions.slice().reverse() : [];
  const downloadChangelogUrl = useMemo(() => getDownloadChangelogUrl(index.runId), [index]);
  // TODO: Reminder: account for this on any diff fetch
  if (resourceVersions.length) resourceVersions[0] += ' (latest)';

  const [versionMode, setVersionMode] = useState(ALL_VERSIONS);
  const [selectedResources, setSelectedResources] = useState([]);
  const [resourceVersionOne, setResourceVersionOne] = useState(resourceVersions[0]);
  const [resourceVersionTwo, setResourceVersionTwo] = useState();

  // TODO: Fetch diff, getDiffResourcesList on changes to version selectors
  const diffResourcesList = getDiffResourcesList(diff);

  const [filteredDiff, setFilteredDiff] = useState(diff);
  const [filteredChangelog, setFilteredChangelog] = useState(changelog);

  /*  
    Clear filters on version mode change.
    Different Resources are available in either mode, not always comparable.
  */
  useEffect(() => {
    setSelectedResources([]);
  }, [versionMode]);

  /* Filter diff based on changes in selectedResources filtering */
  useEffect(() => {
    if (!selectedResources.length) {
      setFilteredDiff(diff);
    } else setFilteredDiff(diff.filter(({ httpMethod, path }) => selectedResources.includes(`${httpMethod} ${path}`)));
  }, [selectedResources, diff]);

  /* Filter changelog based on changes in selectedResources filtering */
  useEffect(() => {
    if (!selectedResources.length) {
      setFilteredChangelog(changelog);
    } else {
      const filteredReleases = changelog.filter((release) => {
        return (
          release.paths.filter(({ httpMethod, path }) => selectedResources.includes(`${httpMethod} ${path}`)).length !==
          0
        );
      });
      const filteredResources = filteredReleases.map((release) => {
        return {
          ...release,
          paths: release.paths.filter(({ httpMethod, path }) => selectedResources.includes(`${httpMethod} ${path}`)),
        };
      });
      setFilteredChangelog(filteredResources);
    }
  }, [selectedResources, changelog]);

  return (
    <ChangelogPage>
      <ChangelogHeader>
        <Title>
          <H2>API Changelog</H2>
          <Body>(2.0{!!index.specRevisionShort && `~${index.specRevisionShort}`})</Body>
        </Title>
        <DownloadButton href={downloadChangelogUrl} disabled={!index.runId}>
          Download API Changelog
        </DownloadButton>
      </ChangelogHeader>
      <FiltersPanel
        resources={versionMode === ALL_VERSIONS ? changelogResourcesList : diffResourcesList}
        selectedResources={selectedResources}
        resourceVersions={resourceVersions}
        versionMode={versionMode}
        resourceVersionOne={resourceVersionOne}
        resourceVersionTwo={resourceVersionTwo}
        setSelectedResources={setSelectedResources}
        setVersionMode={setVersionMode}
        setResourceVersionOne={setResourceVersionOne}
        setResourceVersionTwo={setResourceVersionTwo}
      />
      {(versionMode === ALL_VERSIONS || (resourceVersionOne && resourceVersionTwo)) && (
        <ChangeList
          versionMode={versionMode}
          changes={versionMode === ALL_VERSIONS ? filteredChangelog : filteredDiff}
          selectedResources={selectedResources}
        />
      )}
    </ChangelogPage>
  );
};

export default OpenAPIChangelog;
