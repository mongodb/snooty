import React, { lazy, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from '@gatsbyjs/reach-router';
import { css, cx } from '@leafygreen-ui/emotion';
import IconButton from '@leafygreen-ui/icon-button';
import Icon from '@leafygreen-ui/icon';
import { useBackdropClick } from '@leafygreen-ui/hooks';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { SearchInput as LGSearchInput } from '@leafygreen-ui/search-input';
import { Link } from '@leafygreen-ui/typography';
import useScreenSize from '../../hooks/useScreenSize';
import { theme } from '../../theme/docsTheme';
import debounce from '../../utils/debounce';
import { isBrowser } from '../../utils/is-browser';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { SuspenseHelper } from '../SuspenseHelper';
import { getCurrLocale } from '../../utils/locale';
import { searchIconStyling, searchInputStyling, StyledInputContainer } from './styles';
import { ShortcutIcon, SparkleIcon } from './SparkIcon';
const Chatbot = lazy(() => import('mongodb-chatbot-ui'));
const SearchMenu = lazy(() => import('./SearchMenu'));

const PLACEHOLDER_TEXT = `Search MongoDB Docs or Ask MongoDB AI`;
const PLACEHOLDER_TEXT_MOBILE = 'Search or AI';

// taken from LG/lib - our library is out of date
// https://github.com/mongodb/leafygreen-ui/blob/main/packages/lib/src/index.ts#L102
const keyMap = {
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Backspace: 'Backspace',
  BracketLeft: '[',
  Delete: 'Delete',
  Enter: 'Enter',
  Escape: 'Escape',
  Space: ' ',
  Tab: 'Tab',
};

export const SEARCH_SUGGESTIONS = [
  {
    copy: 'Search',
  },
  {
    copy: 'Ask MongoDB AI',
    icon: <SparkleIcon glyph={'Sparkle'} />,
    shortcutIcon: <ShortcutIcon width={30} height={18} />,
  },
];

const SearchInput = ({ className, slug }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchBoxRef = useRef();
  const inputRef = useRef();
  const menuRef = useRef();
  const metadata = useSnootyMetadata();
  const { darkMode } = useDarkMode();
  const [selectedOption, setSelectedOption] = useState(0);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const { search } = useLocation();
  const locale = getCurrLocale();
  const isEnglish = locale === 'en-us';

  useBackdropClick(
    () => {
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [searchBoxRef, menuRef],
    isOpen
  );

  useEffect(() => {
    if (!searchValue.length) {
      return setIsOpen(false);
    }
    const debounced = debounce(() => {
      setIsOpen(!!searchValue.length && document?.activeElement === inputRef.current);
    }, 500);
    return () => debounced();
  }, [searchValue]);

  const keyPressHandler = useCallback(
    async (event) => {
      // cmd+k or ctrl+k focuses search bar,
      // unless already focused on an input field
      const holdingCtrlCmd = (navigator.userAgent.includes('Mac') && event.metaKey) || event.ctrlKey;
      if (holdingCtrlCmd && event.key === 'k' && document.activeElement.tagName.toLowerCase() !== 'input') {
        event.preventDefault();
        inputRef.current?.focus();
        return;
      }

      // if currently focused on search input and on English site (therefore, chatbot is an option),
      // activates the chatbot modal
      if (event.target.isSameNode(inputRef.current) && event.key === '/' && isEnglish) {
        event.preventDefault();
        setIsOpen(false);
        return menuRef.current?.select(1);
      }
    },
    [isEnglish]
  );

  // adding keyboard shortcuts document wide
  useEffect(() => {
    if (!isBrowser) return;
    document.addEventListener('keydown', keyPressHandler);
    return () => {
      document.removeEventListener('keydown', keyPressHandler);
    };
  }, [keyPressHandler]);

  // focus on mobile open
  useEffect(() => {
    if (mobileSearchActive) {
      inputRef.current?.focus();
    }
  }, [mobileSearchActive]);

  const { isMedium, isMobile } = useScreenSize();

  // reset search input size on screen resize
  useEffect(() => {
    if (!isMedium) {
      setMobileSearchActive(false);
    }
  }, [isMedium]);

  // on init, populate search input field with search params (if any)
  useEffect(() => {
    const searchTerm = new URLSearchParams(search).get('q');
    if (searchTerm) {
      setSearchValue(searchTerm);
    }
  }, [search]);

  // close menu when changing screen size
  useEffect(() => {
    function handleResize() {
      setIsOpen(false);
    }
    window.addEventListener('resize', handleResize);
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, mobileSearchActive]);

  const handleSearchBoxKeyDown = (e) => {
    const isFocusInMenu = menuRef.current?.contains && menuRef.current.contains(document.activeElement);
    const isFocusOnSearchBox = searchBoxRef.current?.contains(document.activeElement);
    const isFocusInComponent = isFocusOnSearchBox || isFocusInMenu;

    if (!isFocusInComponent) {
      return;
    }
    switch (e.key) {
      case keyMap.Enter: {
        menuRef.current?.select?.(selectedOption);
        setIsOpen(false);
        break;
      }

      case keyMap.Escape: {
        setIsOpen(false);
        inputRef.current?.focus();
        break;
      }

      case keyMap.ArrowDown: {
        if (isOpen && isEnglish) {
          setSelectedOption((selectedOption + 1) % 2);
          inputRef.current?.focus();
          e.preventDefault();
        }
        break;
      }

      case keyMap.ArrowUp: {
        if (isOpen && isEnglish) {
          setSelectedOption(Math.abs(selectedOption - (1 % 2)));
          inputRef.current?.focus();
          e.preventDefault();
        }
        break;
      }

      case keyMap.Tab: {
        if (isOpen) {
          setIsOpen(false);
        }
        break;
      }

      default: {
        break;
      }
    }
  };

  const CHATBOT_SERVER_BASE_URL =
    metadata?.snootyEnv === 'dotcomprd'
      ? 'https://knowledge.mongodb.com/api/v1'
      : 'https://knowledge.staging.corp.mongodb.com/api/v1';

  return (
    <StyledInputContainer
      className={cx(className)}
      mobileSearchActive={mobileSearchActive}
      ref={searchBoxRef}
      onKeyDown={handleSearchBoxKeyDown}
    >
      <LGSearchInput
        aria-label="Search MongoDB Docs"
        className={searchInputStyling({ mobileSearchActive })}
        value={searchValue}
        placeholder={isMobile ? PLACEHOLDER_TEXT_MOBILE : PLACEHOLDER_TEXT}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        onClick={() => {
          setIsOpen(!!searchValue.length);
        }}
        onSubmit={(e) => {
          inputRef.current?.blur();
          setIsOpen(false);
        }}
        ref={inputRef}
      />
      {isMedium && mobileSearchActive && (
        <Link
          className={cx(
            css`
              font-size: ${theme.fontSize.small};
              font-weight: 400;
            `
          )}
          onClick={() => {
            setSearchValue('');
            setMobileSearchActive(false);
          }}
        >
          Cancel
        </Link>
      )}
      <SuspenseHelper>
        <Chatbot serverBaseUrl={CHATBOT_SERVER_BASE_URL} darkMode={darkMode}>
          <SearchMenu
            isOpen={!!searchValue.length && isOpen}
            searchBoxRef={searchBoxRef}
            searchValue={searchValue}
            ref={menuRef}
            selectedOption={selectedOption}
            slug={slug}
          ></SearchMenu>
        </Chatbot>
      </SuspenseHelper>
      {!mobileSearchActive && (
        <IconButton
          aria-label="Search MongoDB Docs"
          className={searchIconStyling}
          onClick={() => {
            setIsOpen(false);
            setMobileSearchActive((state) => !state);
          }}
        >
          <Icon glyph={'MagnifyingGlass'} />
        </IconButton>
      )}
    </StyledInputContainer>
  );
};

export default SearchInput;

SearchInput.propTypes = {
  className: PropTypes.string,
  slug: PropTypes.string,
};