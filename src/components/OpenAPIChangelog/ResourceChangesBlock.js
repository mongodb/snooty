import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { Link as LGLink, Subtitle } from '@leafygreen-ui/typography';

const Wrapper = styled.section`
  width: 100%;
`;

const ResourceHeader = styled(Subtitle)`
  color: ${palette.blue.base};
`;

const ResourceChangesBlock = ({ resourceChanges: { path, httpMethod, operationId, tag, versions } }) => {
  const changes = versions.map((version, i) => version.changes.map((change) => change)).flat();

  // TODO: badge for (only?) full changelog list

  return (
    <Wrapper>
      <LGLink hideExternalIcon>
        <ResourceHeader>
          {httpMethod} {path}
        </ResourceHeader>
      </LGLink>
      <ul>
        {changes.map(({ change, backwardCompatible }, i) => (
          <li key={`change-${i}`}>
            {backwardCompatible} {change}
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};

export default ResourceChangesBlock;
