import styled from '@emotion/styled';
import Badge from '@leafygreen-ui/badge';
import { palette } from '@leafygreen-ui/palette';
import { Link as LGLink, Subtitle } from '@leafygreen-ui/typography';
import { useSiteMetadata } from '../../../hooks/use-site-metadata';
import { generatePathPrefix } from '../../../utils/generate-path-prefix';
import { changeTypeBadge } from '../utils/changeTypeBadge';
import Change, { Flex } from './Change';

const Wrapper = styled.div`
  width: 100%;
  margin: 22px 0;
`;

const ResourceHeader = styled(Subtitle)`
  color: ${palette.blue.base};
`;

const ChangeTypeBadge = styled(Badge)`
  margin-top: 2px;
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

const ResourceChangesBlock = ({ data: { path, httpMethod, operationId, tag, changes, changeType, versions } }) => {
  const metadata = useSiteMetadata();
  const pathPrefix = generatePathPrefix(metadata);
  const resourceTag = `#tag/${tag.split(' ').join('-')}/operation/${operationId}`;

  const resourceChanges =
    changes ||
    versions
      .map((version) =>
        version.changes.map((change) => ({ ...change, version: version.version, changeType: versions[0].changeType }))
      )
      .flat();

  const badge = changeTypeBadge[changeType || versions[0].changeType];

  return (
    <Wrapper>
      <Flex>
        <LGLink href={`${pathPrefix}/reference/api-resources-spec/v2.0/${resourceTag}`} hideExternalIcon>
          <ResourceHeader>
            {httpMethod} {path}
          </ResourceHeader>
        </LGLink>
        <ChangeTypeBadge variant={badge.variant}>{badge.label}</ChangeTypeBadge>
      </Flex>
      <ChangeListUL>
        {resourceChanges.map((change, i) => (
          <Change key={`change-${i}`} {...change} />
        ))}
      </ChangeListUL>
    </Wrapper>
  );
};

export default ResourceChangesBlock;
