import styled from '@emotion/styled';
import { H3 } from '@leafygreen-ui/typography';
import { format } from 'date-fns';
import ResourceChangesBlock from './ResourceChangesBlock';

const Wrapper = styled.section`
  width: 100%;
  margin-top: 28px;
`;

const ReleaseDateBlock = ({ date: releaseDate, paths }) => {
  const formattedReleaseDate = format(new Date(releaseDate.replace(/-/g, '/')), 'dd MMMM y');

  return (
    <Wrapper>
      <H3>{`${formattedReleaseDate} Release`}</H3>
      {paths.map((path, i) => (
        <ResourceChangesBlock key={`resource-${i}`} {...path} />
      ))}
    </Wrapper>
  );
};

export default ReleaseDateBlock;
