import styled from '@emotion/styled';
import ReleaseDateBlock from './ReleaseDateBlock';
import ResourceChangesBlock from './ResourceChangesBlock';

const Wrapper = styled.div`
  width: 100%;
`;

const ChangeList = ({ versionMode, changes }) => {
  // TODO: replace with correct conditional
  const ChangeListComponent = versionMode ? ResourceChangesBlock : ReleaseDateBlock;

  return (
    <Wrapper>
      {changes.map((data, i) => (
        <ChangeListComponent key={`change-list-${i}`} {...data} />
      ))}
    </Wrapper>
  );
};

export default ChangeList;
