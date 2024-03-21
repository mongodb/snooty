import React, { lazy } from 'react';
import Skeleton from 'react-loading-skeleton';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { SuspenseHelper } from './SuspenseHelper';

export const defaultSuggestedPrompts = [
  'Get started with MongoDB',
  'How do I register for Atlas?',
  'How do you deploy a free cluster in Atlas?',
  'How do you import or migrate data into MongoDB Atlas?',
  'Why should I use Atlas Search?',
];

const SKELETON_BORDER_RADIUS = '12px';

// Match landing template max width for alignment purposes
const CONTENT_MAX_WIDTH = theme.breakpoints.xxLarge;

const landingTemplateStyling = css`
  position: sticky;
  top: 0px;
  display: grid;
  padding: 16px 0px 0px 0px;
  // Use landing template's grid layout to help with alignment
  @media ${theme.screenSize.mediumAndUp} {
    grid-template-columns: minmax(${theme.size.xlarge}, 1fr) repeat(12, minmax(0, ${CONTENT_MAX_WIDTH / 12}px)) minmax(
        ${theme.size.xlarge},
        1fr
      );
  }

  @media ${theme.screenSize.upToMedium} {
    grid-template-columns: 48px repeat(12, 1fr) 48px;
  }

  @media ${theme.screenSize.upToSmall} {
    grid-template-columns: ${theme.size.large} 1fr ${theme.size.large};
  }

  @media ${theme.screenSize.upToXSmall} {
    grid-template-columns: ${theme.size.medium} 1fr ${theme.size.medium};
  }

  // Ensure direct children (Chatbot and Loading Skeleton) of the container are
  // in the correct column
  > div,
  span {
    grid-column: 2 / -2;
  }
`;

const StyledChatBotUiContainer = styled.div`
  padding: ${theme.size.default} 50px;
  z-index: 1;
  width: 100%;
  background: ${palette.white};
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);
  min-height: 96px;
  align-items: center;

  > div {
    max-width: 862px;
    p {
      color: ${palette.black};
    }

    @media ${theme.screenSize.upToLarge} {
      max-width: unset;
    }
  }

  // Styling the chatbot's loading skeleton
  > span {
    display: flex;
    height: 48px;
    align-items: self-end;
  }

  ${({ template }) => template === 'landing' && landingTemplateStyling};
`;

const DocsChatbot = lazy(() =>
  import('mongodb-chatbot-ui').then((module) => {
    return { default: module.DocsChatbot };
  })
);

const Chatbot = lazy(() => import('mongodb-chatbot-ui'));

const ChatbotUi = ({ template }) => {
  const { snootyEnv } = useSiteMetadata();

  const CHATBOT_SERVER_BASE_URL =
    snootyEnv === 'dotcomprd'
      ? 'https://knowledge.mongodb.com/api/v1'
      : 'https://knowledge.staging.corp.mongodb.com/api/v1';

  return (
    <StyledChatBotUiContainer data-testid="chatbot-ui" template={template}>
      {/* We wrapped this in a Suspense. We can use this opportunity to render a loading state if we decided we want that */}
      <SuspenseHelper fallback={<Skeleton borderRadius={SKELETON_BORDER_RADIUS} height={48} />}>
        <Chatbot maxInputCharacters={DEFAULT_MAX_INPUT} serverBaseUrl={CHATBOT_SERVER_BASE_URL}>
          <DocsChatbot suggestedPrompts={defaultSuggestedPrompts} />
        </Chatbot>
      </SuspenseHelper>
    </StyledChatBotUiContainer>
  );
};

export default ChatbotUi;
export const DEFAULT_MAX_INPUT = 300;
