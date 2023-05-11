import styled from '@emotion/styled';
import Badge from '@leafygreen-ui/badge';
import { palette } from '@leafygreen-ui/palette';
import { Link as LGLink, Subtitle } from '@leafygreen-ui/typography';
import { useSiteMetadata } from '../../../hooks/use-site-metadata';
import useSnootyMetadata from '../../../utils/use-snooty-metadata';
import { getChangeTypeBadge } from '../utils/constants';
import { getResourceLinkUrl } from '../utils/getResourceLinkUrl';
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

const ResourceChangesBlock = ({ path, httpMethod, operationId, tag, changes, changeType, versions }) => {
  const metadata = useSiteMetadata();
  const { openapi_pages } = useSnootyMetadata();

  const resourceLinkUrl = getResourceLinkUrl(metadata, tag, operationId, openapi_pages);
  const resourceChanges = changes || versions.map((version) => version.changes.map((change) => change)).flat();
  const badge = getChangeTypeBadge[changeType || versions[0].changeType];

  return (
    <Wrapper>
      <Flex>
        <LGLink href={resourceLinkUrl} hideExternalIcon>
          <ResourceHeader>
            {httpMethod} {path}
          </ResourceHeader>
        </LGLink>
        {badge ? <ChangeTypeBadge variant={badge.variant}>{badge.label}</ChangeTypeBadge> : null}
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
