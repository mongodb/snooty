import React from 'react';
import styled from '@emotion/styled';
import Button from '@leafygreen-ui/button';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import Link from '../Link';
import ConditionalWrapper from '../ConditionalWrapper';
import { theme } from '../../theme/docsTheme';
import { formatText } from '../../utils/format-text';
import type { Node } from '../../types/ast';
import type { Guide } from './GuidesList';

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
  color: var(--color);
  font-size: ${theme.fontSize.default};
  margin-bottom: ${theme.size.default};
`;

const Title = styled('div')`
  font-size: ${theme.fontSize.h2};
  font-weight: bold;
`;

const Time = styled('div')`
  font-size: ${theme.fontSize.small};
  font-weight: normal;
`;

const defaultTarget: [string, Guide] = [
  'https://university.mongodb.com/certification/developer/about',
  {
    title: 'Become a MongoDB Professional',
    description:
      "Congrats. You've completed all the guides. Want to take the next step? Register for the developer exam.",
  },
];

interface ContentProps {
  argument: Node[];
  children: Node[];
  guideData: [string, Guide] | [null, null];
}

const Content = ({ argument, children, guideData }: ContentProps) => {
  const hasCustomContent = argument?.length > 0 || children?.length > 0;
  const hasNextGuide = !!guideData[0] && !!guideData[1];
  const { darkMode } = useDarkMode();

  let [buttonUrl, content] = hasNextGuide ? guideData : defaultTarget;
  if (hasCustomContent) {
    content = {
      title: argument,
      description: children,
    };
  }
  const buttonText = hasNextGuide ? 'Start Guide' : 'Learn More';

  return (
    <Container>
      <Heading style={{ color: darkMode ? palette.gray.light2 : palette.gray.dark1 }}>What's Next</Heading>
      <Title>
        {formatText(content.title)}
        {!!content.completion_time && <Time>{content.completion_time} mins</Time>}
      </Title>
      <ConditionalWrapper condition={typeof content.description === 'string'} wrapper={(children) => <p>{children}</p>}>
        {formatText(content.description)}
      </ConditionalWrapper>
      {/* We only want to show the button if argument/children are empty */}
      {!hasCustomContent && buttonUrl && (
        <Button
          as={Link}
          href={buttonUrl}
          variant="primary"
          className={css`
            color: #ffffff !important;
          `}
        >
          {buttonText}
        </Button>
      )}
    </Container>
  );
};

export default Content;
