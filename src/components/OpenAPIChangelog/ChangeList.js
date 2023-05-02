import styled from '@emotion/styled';
import ChangelogReleaseBlock from './ChangelogReleaseBlock';
import { mockData } from './data/mockData';

const Wrapper = styled.div`
  width: 100%;
`;

const ChangeList = () => {
  const changes = mockData;

  return (
    <Wrapper>
      {changes.map((release, i) => (
        <ChangelogReleaseBlock key={`release-${i}`} releaseBlock={release} />
      ))}
    </Wrapper>
  );
};

export default ChangeList;
