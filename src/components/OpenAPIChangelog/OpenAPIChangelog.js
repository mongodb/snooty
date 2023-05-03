import { useState } from 'react';
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

const OpenAPIChangelog = () => {
  const [versionMode, setVersionMode] = useState(false);
  const changelog = mockChangelog;
  const diff = mockDiff;

  return (
    <ChangelogPage>
      <ChangelogHeader>
        <H2>API Changelog</H2>
        <Button>Download API Changelog</Button>
      </ChangelogHeader>
      <input type="radio" id="all-versions" checked={!versionMode} onChange={() => setVersionMode(false)} />
      <label for="all-versions">All Versions</label>
      <br />
      <input type="radio" id="compare-two" checked={versionMode} onChange={() => setVersionMode(true)} />
      <label for="compare-two">Compare Two Versions</label>
      <FiltersPanel />
      <ChangeList versionMode={versionMode} changes={versionMode ? diff : changelog} />
    </ChangelogPage>
  );
};

export default OpenAPIChangelog;
