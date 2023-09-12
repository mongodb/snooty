import { Subtitle } from '@leafygreen-ui/typography';
import styled from '@emotion/styled';
import { cx, css } from '@leafygreen-ui/emotion';

import Video from '../../Video';
import ComponentFactory from '../../ComponentFactory';
import { theme } from '../../../theme/docsTheme';

const StyledContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  grid-column-start: 2;
  grid-column-end: 14;
  max-width: 1440px;
  gap: 2rem;
  @media ${theme.screenSize.upToLarge} {
    flex-direction: column;
    width: 100%;
  }
`;

const VideoItem = styled('div')`
  min-width: 50%;
`;

const DescriptionItem = styled('div')`
  margin-top: 24px;
  max-width: 50%;
  @media ${theme.screenSize.upToLarge} {
    margin-top: 0px;
    max-width: 100%;
  }
`;

const headerStyles = css`
  padding-bottom: 10px;
`;

export const MoreWays = ({ nodeData: { children, options, argument }, ...rest }) => {
  return (
    <StyledContainer>
      <VideoItem>
        <Video nodeData={{ argument: [{ refuri: options.video_url }] }} />
      </VideoItem>
      <DescriptionItem>
        <Subtitle className={cx(headerStyles)}>{argument[0]?.value}</Subtitle>
        {children.map((child, i) => (
          <ComponentFactory nodeData={child} key={i} {...rest} showLinkArrow={true} />
        ))}
      </DescriptionItem>
    </StyledContainer>
  );
};
