import React from 'react';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import { css, cx } from '@leafygreen-ui/emotion';
import { uiColors } from '@leafygreen-ui/palette';
import { formatText } from '../../utils/format-text';
import Link from '../Link';
import { theme } from '../../theme/docsTheme';

const Container = styled('div')`
  p {
    margin-top: ${theme.size.small};
  }

  @media ${theme.screenSize.largeAndUp} {
    flex-basis: 0;
    flex-grow: 1;
  }
`;

const Heading = styled('div')`
  color: ${uiColors.gray.dark1} !important;
  font-size: ${theme.fontSize.default} !important;
  margin-bottom: ${theme.size.default};
`;

const Title = styled('div')`
  font-size: ${theme.fontSize.h2};
  font-weight: bold;
`;

const Time = styled('span')`
  display: inline-block;
  font-size: ${theme.fontSize.small};
  font-weight: normal;
  margin-left: ${theme.size.small};
`;

const buttonStyling = css`
  margin-bottom: 40px;
`;

const defaultTarget = [
  'https://university.mongodb.com/certification/developer/about',
  {
    title: 'Become a MongoDB Professional',
    description:
      'Congrats. You’ve completed all the guides. Want to take the next step? Register for the developer exam.',
  },
];

const Content = ({ guideData }) => {
  const isValidGuide = !!guideData[0] && !!guideData[1];
  const [targetSlug, targetData] = isValidGuide ? guideData : defaultTarget;
  const buttonText = isValidGuide ? 'Start Guide' : 'Learn More';

  return (
    <Container>
      <Heading>What's Next</Heading>
      <Title>
        {formatText(targetData.title)}
        {!!targetData.completion_time && <Time>{targetData.completion_time} mins</Time>}
      </Title>
      {isValidGuide ? formatText(targetData.description) : <p>{targetData.description}</p>}
      <Button as={Link} baseFontSize={16} className={cx(buttonStyling)} to={targetSlug} variant="primary">
        {buttonText}
      </Button>
    </Container>
  );
};

export default Content;
