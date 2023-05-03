import styled from '@emotion/styled';
import ChangelogReleaseBlock from './ChangelogReleaseBlock';
import ResourceChangesBlock from './ResourceChangesBlock';

const Wrapper = styled.div`
  width: 100%;
`;

const ChangeList = ({ versionMode, changes }) => {
  const ChangeListComponent = versionMode ? ResourceChangesBlock : ChangelogReleaseBlock;

  return (
    <Wrapper>
      {changes.map((data, i) => (
        <ChangeListComponent key={`change-list-${i}`} data={data} />
      ))}
    </Wrapper>
  );
};

export default ChangeList;
