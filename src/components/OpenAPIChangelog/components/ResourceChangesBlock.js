import styled from '@emotion/styled';
import Badge from '@leafygreen-ui/badge';
import { palette } from '@leafygreen-ui/palette';
import { Link as LGLink, Subtitle } from '@leafygreen-ui/typography';
import { useSiteMetadata } from '../../../hooks/use-site-metadata';
import { theme } from '../../../theme/docsTheme';
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
  word-break: break-all;
`;

const FlexLinkWrapper = styled(Flex)`
  @media ${theme.screenSize.upToMedium} {
    flex-direction: column;
    align-items: start;
  }
`;

const ChangeTypeBadge = styled(Badge)`
  margin-top: 2px;
`;

const ChangeListUL = styled.ul`
  margin: 0;
  list-style-position: start;
`;

const ResourceChangesBlock = ({ path, httpMethod, operationId, tag, changes, changeType, versions }) => {
  const metadata = useSiteMetadata();
  const { openapi_pages } = useSnootyMetadata();

  const resourceLinkUrl = getResourceLinkUrl(metadata, tag, operationId, openapi_pages);
  const resourceChanges = changes || versions.map((version) => version.changes.map((change) => change)).flat();
  const badge = getChangeTypeBadge[changeType || versions[0].changeType];

  return (
    <Wrapper data-testid="resource-changes-block">
      <FlexLinkWrapper>
        <LGLink href={resourceLinkUrl} hideExternalIcon>
          <ResourceHeader>
            {httpMethod} {path}
          </ResourceHeader>
        </LGLink>
        {badge ? <ChangeTypeBadge variant={badge.variant}>{badge.label}</ChangeTypeBadge> : null}
      </FlexLinkWrapper>
      <ChangeListUL>
        {resourceChanges.map((change, i) => (
          <Change key={`change-${i}`} {...change} />
        ))}
      </ChangeListUL>
    </Wrapper>
  );
};

export default ResourceChangesBlock;
