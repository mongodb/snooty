import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { Link as LGLink, Subtitle } from '@leafygreen-ui/typography';
import { useSiteMetadata } from '../../../hooks/use-site-metadata';
import { generatePathPrefix } from '../../../utils/generate-path-prefix';
import Change from './Change';

const Wrapper = styled.div`
  width: 100%;
  margin: 22px 0;
`;

const ResourceHeader = styled(Subtitle)`
  color: ${palette.blue.base};
`;

const ChangeListUL = styled.ul`
  margin: 0;
  padding-left: 7px;
  list-style-type: none;

  li:before {
    content: '•';
    vertical-align: top;
    line-height: 28px;
    margin-right: 5px;
  }
`;

const ResourceChangesBlock = ({ data: { path, httpMethod, operationId, tag, changes, versions } }) => {
  const metadata = useSiteMetadata();
  const pathPrefix = generatePathPrefix(metadata);
  const resourceTag = `#tag/${tag.split(' ').join('-')}/operation/${operationId}`;

  const resourceChanges =
    changes ??
    versions.map((version) => version.changes.map((change) => ({ ...change, version: version.version }))).flat();

  // TODO: badge for (only?) full changelog list... Asking Ciprian

  return (
    <Wrapper>
      <LGLink href={`${pathPrefix}/reference/api-resources-spec/v2.0/${resourceTag}`} hideExternalIcon>
        <ResourceHeader>
          {httpMethod} {path}
        </ResourceHeader>
      </LGLink>
      <ChangeListUL>
        {resourceChanges.map((change, i) => (
          <Change key={`change-${i}`} {...change} />
        ))}
      </ChangeListUL>
    </Wrapper>
  );
};

export default ResourceChangesBlock;
