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

export const ALL_VERSIONS = 'allVersions';
export const COMPARE_VERSIONS = 'compareVersions';

const OpenAPIChangelog = () => {
  const [changeLogView, setChangelogView] = useState(ALL_VERSIONS);

  function handleChangelogViewChange(value) {
    setChangelogView(value);
  }
  return (
    <ChangelogPage>
      <ChangelogHeader>
        <H2>API Changelog</H2>
        <Button>Download API Changelog</Button>
      </ChangelogHeader>
      <FiltersPanel changeLogView={changeLogView} handleChange={handleChangelogViewChange} />
      <ChangeList />
    </ChangelogPage>
  );
};

export default OpenAPIChangelog;
