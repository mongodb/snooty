import React, { useMemo, useCallback, forwardRef, useEffect } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { useChatbotContext, ModalView, MongoDbLegalDisclosure, PoweredByAtlasVectorSearch } from 'mongodb-chatbot-ui';
import PropTypes from 'prop-types';
import { SearchResult, SearchResultsMenu } from '@leafygreen-ui/search-input';
import { theme } from '../../theme/docsTheme';
import { ShortcutIcon, SparkleIcon } from './SparkIcon';

// using content before/after to prevent event bubbling up from lg/search-input/search-result
// package above gets all text inside node, and sets the value of Input node of all text within search result:
// https://github.com/mongodb/leafygreen-ui/blob/%40leafygreen-ui/search-input%402.1.4/packages/search-input/src/SearchInput/SearchInput.tsx#L149-L155
const suggestionStyling = ({ copy }) => css`
  & > div:before {
    content: '${copy} "';
  }

  & > div:after {
    content: '"';
  }

  svg:first-of-type {
    float: left;
    margin-right: ${theme.size.tiny};
  }

  padding: ${theme.fontSize.tiny} ${theme.size.medium};

  svg:last-of-type {
    float: right;
  }
`;

const SearchSuggestions = forwardRef(function SearchSuggestions(
  { searchValue, refEl, chatbotAvailable, setChatbotAvailable },
  ref
) {
  const { setInputText, handleSubmit, conversation } = useChatbotContext();

  const SEARCH_SUGGESTIONS = useMemo(
    () => [
      {
        copy: 'Search',
      },
      {
        copy: 'Ask MongoDB AI',
        icon: <SparkleIcon glyph={'Sparkle'} />,
        shortcutIcon: <ShortcutIcon width={30} height={18} />,
      },
    ],
    []
  );

  useEffect(() => {
    const initChatbot = async () => {
      try {
        if (!conversation.conversationId) {
          await conversation.createConversation();
        }
        setChatbotAvailable(true);
      } catch (e) {
        console.error(e);
        setChatbotAvailable(false);
      }
    };
    initChatbot();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = useCallback(
    async (isChatbot) => {
      if (isChatbot && chatbotAvailable) {
        setInputText(searchValue);
        return handleSubmit(searchValue);
      }
      window.location.href = `https://mongodb.com/docs/search/?q=${searchValue}`;
    },
    [chatbotAvailable, handleSubmit, searchValue, setInputText]
  );

  return (
    <div className={'test-search-suggestions'}>
      <SearchResultsMenu ref={ref} refEl={refEl} open={true} usePortal={false}>
        {SEARCH_SUGGESTIONS.map((suggestion, i) => (
          <SearchResult
            className={cx(suggestionStyling({ copy: suggestion.copy }))}
            key={i}
            onClick={handleClick.bind(!!suggestion.shortcutIcon)}
          >
            {suggestion.icon}
            {searchValue}
            {suggestion.shortcutIcon}
          </SearchResult>
        ))}
      </SearchResultsMenu>
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
    </div>
  );
});

export default SearchSuggestions;

SearchSuggestions.propTypes = {
  searchValue: PropTypes.string.isRequired,
  setChatbotAvailable: PropTypes.func.isRequired,
  chatbotAvailable: PropTypes.bool.isRequired,
};
