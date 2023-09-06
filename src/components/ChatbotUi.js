import React, { Suspense, lazy } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from '../theme/docsTheme';
import 'react-loading-skeleton/dist/skeleton.css';

const CHATBOT_SERVER_BASE_URL =
  process.env.SNOOTY_ENV === 'production' || process.env.SNOOTY_ENV === 'dotcomprd'
    ? 'https://knowledge.corp.mongodb.com/api/v1'
    : 'https://knowledge.staging.corp.mongodb.com/api/v1';

const SKELETON_BORDER_RADIUS = '12px';

const formWidth = (measurement) => {
  let _measurement = measurement;

  if (typeof measurement !== 'string' && typeof measurement !== 'number') {
    console.error('using the wrong measurement value');
    // set it to the original style from the package
    _measurement = '100%';
  }

  if (typeof measurement === 'number') {
    _measurement = `${measurement}px`;
  }
  return css`
    form {
      width: ${_measurement};
    }
  `;
};

const StyledChatBotUiContainer = styled.div`
  margin-left: 60px;
  margin-top: 20px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
  ${formWidth(771)}

  @media ${theme.screenSize.upToXLarge} {
    ${formWidth(704)}
  }

  @media ${theme.screenSize.upToMedium} {
    ${formWidth('90%')}
  }

  p {
    color: #001e2b !important; /* a workaround for handling the color issue until the next release of the mongodb-chatbot-ui */
  }
`;

const LazyChatbot = lazy(() => import('mongodb-chatbot-ui'));

const ChatbotUi = () => {
  return (
    <StyledChatBotUiContainer data-testid="chatbot-ui">
      {/* We wrapped this in a Suspend. We can use this opportunity to render a loading state if we decided we want that */}
      <Suspense fallback={<Skeleton borderRadius={SKELETON_BORDER_RADIUS} width={771} height={82} />}>
        <LazyChatbot serverBaseUrl={CHATBOT_SERVER_BASE_URL} />
      </Suspense>
    </StyledChatBotUiContainer>
  );
};

export default ChatbotUi;
