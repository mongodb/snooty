import styled from '@emotion/styled';
import { H2 } from '@leafygreen-ui/typography';
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

const OpenAPIChangelog = () => {
  return (
    <ChangelogPage>
      <ChangelogHeader>
        <H2>API Changelog</H2>
        <Button>Download API Changelog</Button>
      </ChangelogHeader>
      <FiltersPanel />
      <ChangeList />
    </ChangelogPage>
  );
};

export default OpenAPIChangelog;
