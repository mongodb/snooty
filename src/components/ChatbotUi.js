import React, { Suspense, lazy } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import 'react-loading-skeleton/dist/skeleton.css';

const CHATBOT_SERVER_BASE_URL =
  process.env.SNOOTY_ENV === 'production' || process.env.SNOOTY_ENV === 'dotcomprd'
    ? 'https://knowledge.mongodb.com/api/v1'
    : 'https://knowledge.staging.corp.mongodb.com/api/v1';

const SKELETON_BORDER_RADIUS = '12px';

const StyledChatBotUiContainer = styled.div(
  ({ template }) => `
  ${
    template === 'landing'
      ? `position: sticky;
  top: 0px;`
      : `position: relative;`
  }
  padding: 16px 50px;
  z-index: 1;
  width: 100%;
  background: ${palette.white};
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);

  > div {
    max-width: 771px;
    p {
      color: ${palette.black};
    }

    @media ${theme.screenSize.upToLarge} {
      max-width: unset;
    }
  }

`
);

const LazyChatbot = lazy(() => import('mongodb-chatbot-ui'));

const ChatbotUi = ({ template }) => {
  return (
    <StyledChatBotUiContainer data-testid="chatbot-ui" template={template}>
      {/* We wrapped this in a Suspense. We can use this opportunity to render a loading state if we decided we want that */}
      <Suspense fallback={<Skeleton borderRadius={SKELETON_BORDER_RADIUS} width={771} height={82} />}>
        <LazyChatbot serverBaseUrl={CHATBOT_SERVER_BASE_URL} />
      </Suspense>
    </StyledChatBotUiContainer>
  );
};

export default ChatbotUi;
