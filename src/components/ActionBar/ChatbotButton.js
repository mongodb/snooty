import React from 'react';
import { useChatbotContext, ModalView, MongoDbLegalDisclosure, PoweredByAtlasVectorSearch } from 'mongodb-chatbot-ui';
import { css, cx } from '@leafygreen-ui/emotion';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
import { reportAnalytics } from '../../utils/report-analytics';
import { displayNone } from '../../utils/display-none';
import { SparkleIcon } from './SparkIcon';

const buttonStyling = css`
  text-wrap-mode: nowrap;
  ${displayNone.onMobileAndTablet}
`;

const iconStyling = css`
  ${displayNone.onLargerThanTablet}
`;

const ChatbotButton = () => {
  const { openChat } = useChatbotContext();
  const onClick = () => {
    reportAnalytics('Chatbot button clicked');
    openChat();
  };
  return (
    <>
      <Button
        className={cx(buttonStyling)}
        leftGlyph={<Icon glyph="Sparkle" />}
        aria-label={'Ask MongoDB AI'}
        variant={'primaryOutline'}
        onClick={onClick}
      >
        Ask Mongodb AI
      </Button>
      <IconButton className={iconStyling} variant={'primaryOutline'} aria-label="Ask MongoDB AI" onClick={onClick}>
        <SparkleIcon />
      </IconButton>
      <ModalView
        inputBottomText={
          'This is an experimental generative AI chatbot. All information should be verified prior to use.'
        }
        disclaimer={
          <>
            <MongoDbLegalDisclosure />
            <PoweredByAtlasVectorSearch
              linkStyle="text"
              className={css`
                margin-top: 8px;
              `}
            />
          </>
        }
      />
    </>
  );
};

export default ChatbotButton;
