import React, { lazy, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { SearchInput as LGSearchInput } from '@leafygreen-ui/search-input';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import debounce from '../../utils/debounce';
import { isBrowser } from '../../utils/is-browser';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { SuspenseHelper } from '../SuspenseHelper';

// lazy load chatbot components
const Chatbot = lazy(() => import('mongodb-chatbot-ui'));
const SearchSuggestions = lazy(() => import('./SearchSuggestions'));

const PLACEHOLDER_TEXT = `Search MongoDB Docs or Ask MongoDB AI`;

const inputStyling = css`
  width: 100%;
  max-width: 610px;

  > div[role='searchbox'] {
    background-color: var(--search-input-background-color);
  }

  --search-input-background-color: ${palette.white};
  .dark-theme & {
    --search-input-background-color: ${palette.gray.dark4};
  }
`;

const StyledMenu = styled.div`
  position: absolute;
  width: 100%;
`;

const SearchInput = ({ className }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [chatbotAvailable, setChatbotAvailable] = useState(false);
  const shortcutKeyPressed = useRef(false);
  const containerRef = useRef();
  const searchResultsRef = useRef();
  const metadata = useSnootyMetadata();
  const { darkMode } = useDarkMode();
  const CHATBOT_SERVER_BASE_URL =
    metadata?.snootyEnv === 'dotcomprd'
      ? 'https://knowledge.mongodb.com/api/v1'
      : 'https://knowledge.staging.corp.mongodb.com/api/v1';

  const keyPressHandler = useCallback((event) => {
    if ((navigator.userAgent.includes('Mac') && event.key === 'Meta') || event.key === 'Control') {
      shortcutKeyPressed.current = event.type === 'keydown';
    }
  }, []);

  useEffect(() => {
    if (!searchValue.length) {
      return setIsOpen(false);
    }
    const debounced = debounce(() => {
      setIsOpen(searchValue.length > 0);
    }, 500);
    return () => debounced();
  }, [searchValue]);

  useEffect(() => {
    if (!isBrowser) return;
    document.addEventListener('keydown', keyPressHandler);
    document.addEventListener('keyup', keyPressHandler);
    return () => {
      document.removeEventListener('keydown', keyPressHandler);
      document.addEventListener('keyup', keyPressHandler);
    };
  }, [keyPressHandler]);

  return (
    <div ref={containerRef} className={cx(inputStyling, className)}>
      <LGSearchInput
        aria-label="Search MongoDB Docs"
        value={searchValue}
        placeholder={PLACEHOLDER_TEXT}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      ></LGSearchInput>
      <StyledMenu ref={searchResultsRef}>
        <SuspenseHelper>
          <Chatbot serverBaseUrl={CHATBOT_SERVER_BASE_URL} darkMode={darkMode}>
            {isOpen && searchValue.length ? (
              <SearchSuggestions
                refEl={containerRef}
                ref={searchResultsRef}
                searchValue={searchValue}
                setChatbotAvailable={setChatbotAvailable}
                chatbotAvailable={chatbotAvailable}
              />
            ) : undefined}
          </Chatbot>
        </SuspenseHelper>
      </StyledMenu>
    </div>
  );
};

export default SearchInput;

SearchInput.propTypes = {
  className: PropTypes.string,
};
