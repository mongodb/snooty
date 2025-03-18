import React, { lazy } from 'react';
import PropTypes from 'prop-types';
import { Skeleton } from '@leafygreen-ui/skeleton-loader';
import { palette } from '@leafygreen-ui/palette';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../theme/docsTheme';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { SuspenseHelper } from './SuspenseHelper';

export const defaultSuggestedPrompts = [
  'Get started with MongoDB',
  'How do I register for Atlas?',
  'How do you deploy a free cluster in Atlas?',
  'Why should I use Atlas Search?',
];

const StyledSkeleton = styled(Skeleton)`
  background: linear-gradient(110deg, rgb(232, 237, 235) 35%, rgb(249, 251, 250), rgb(232, 237, 235) 65%) 0px 0px /
    100vw 100% fixed;

  .dark-theme & {
    background: linear-gradient(110deg, rgb(61, 79, 88) 35%, rgb(92, 108, 117), rgb(61, 79, 88) 65%) 0px 0px / 100vw
      100% fixed;
  }
`;

// Match landing template max width for alignment purposes
const CONTENT_MAX_WIDTH = theme.breakpoints.xxLarge;

const landingTemplateStyling = css`
  background: var(--background-color-primary);
  position: sticky;
  top: 0px;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);
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

  > div {
    max-width: 862px;

    @media ${theme.screenSize.upToLarge} {
      max-width: unset;
    }
  }

  // Ensure direct children (Chatbot and Loading Skeleton) of the container are
  // in the correct column
  > div,
  span {
    grid-column: 2 / -2;
  }

  // Styling the chatbot's loading skeleton
  > span {
    display: flex;
    height: 48px;
    align-items: self-end;
  }
`;

const errorPageTemplateStyling = css`
  position: sticky;
  top: 0px;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.1);
  padding: 16px 0px 0px 0px;

  > div {
    max-width: 910px;
    margin: auto;

    @media only screen and (max-width: 1038px) {
      margin: 0 64px;
    }
  }

  // Styling the chatbot's loading skeleton
  > span {
    max-width: 910px;
    margin: auto;
    display: flex;
    height: 48px;
    align-items: self-end;

    @media only screen and (max-width: 1038px) {
      margin: 0 64px;
    }
  }
`;

const templateStylingMap = {
  errorpage: errorPageTemplateStyling,
  landing: landingTemplateStyling,
};

const StyledChatBotUiContainer = styled.div`
  padding: ${theme.size.default} 50px;
  z-index: 1;
  width: 100%;
  background: ${process.env.GATSBY_ENABLE_DARK_MODE === 'true' ? 'inherit' : palette.white};
  min-height: 96px;
  align-items: center;

  ${({ template }) => template in templateStylingMap && templateStylingMap[template]};
`;

const DocsChatbot = lazy(() =>
  import('mongodb-chatbot-ui').then((module) => {
    return { default: module.DocsChatbot };
  })
);

const Chatbot = lazy(() => import('mongodb-chatbot-ui'));

const ChatbotUi = ({ template, darkMode }) => {
  const { snootyEnv } = useSiteMetadata();

  const CHATBOT_SERVER_BASE_URL =
    snootyEnv === 'dotcomprd'
      ? 'https://knowledge.mongodb.com/api/v1'
      : 'https://knowledge.staging.corp.mongodb.com/api/v1';

  return (
    <StyledChatBotUiContainer data-testid="chatbot-ui" template={template}>
      {/* We wrapped this in a Suspense. We can use this opportunity to render a loading state if we decided we want that */}
      <SuspenseHelper fallback={<StyledSkeleton darkMode={darkMode} />}>
        <Chatbot maxInputCharacters={DEFAULT_MAX_INPUT} serverBaseUrl={CHATBOT_SERVER_BASE_URL} darkMode={darkMode}>
          <DocsChatbot suggestedPrompts={defaultSuggestedPrompts} darkMode={darkMode} />
        </Chatbot>
      </SuspenseHelper>
    </StyledChatBotUiContainer>
  );
};

ChatbotUi.defaultProps = {
  darkMode: false,
};

ChatbotUi.prototype = {
  darkMode: PropTypes.bool,
};

export default ChatbotUi;
export const DEFAULT_MAX_INPUT = 300;
