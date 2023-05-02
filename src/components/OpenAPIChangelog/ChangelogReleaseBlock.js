import styled from '@emotion/styled';
import { H3 } from '@leafygreen-ui/typography';
import ResourceChangesBlock from './ResourceChangesBlock';

const Wrapper = styled.section`
  width: 100%;
`;

const ChangelogReleaseBlock = ({ releaseBlock: { date: releaseDate, paths } }) => {
  return (
    <Wrapper>
      <H3>{releaseDate}</H3>
      {paths.map((path, i) => (
        <ResourceChangesBlock resourceChanges={path} />
      ))}
    </Wrapper>
  );
};

export default ChangelogReleaseBlock;
