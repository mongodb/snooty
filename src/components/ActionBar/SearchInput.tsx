import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { navigate } from 'gatsby';
import PropTypes from 'prop-types';
import { useLocation } from '@gatsbyjs/reach-router';
import { css, cx } from '@leafygreen-ui/emotion';
import IconButton from '@leafygreen-ui/icon-button';
import Icon from '@leafygreen-ui/icon';
import { SearchInput as LGSearchInput } from '@leafygreen-ui/search-input';
import { Link } from '@leafygreen-ui/typography';
import { useAllDocsets } from '../../hooks/useAllDocsets';
import useScreenSize from '../../hooks/useScreenSize';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { theme } from '../../theme/docsTheme';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { isBrowser } from '../../utils/is-browser';
import { localizePath } from '../../utils/locale';
import { reportAnalytics } from '../../utils/report-analytics';
import { searchIconStyling, searchInputStyling, StyledInputContainer, StyledSearchBoxRef } from './styles';

export const PLACEHOLDER_TEXT = `Search MongoDB Docs`;
const PLACEHOLDER_TEXT_MOBILE = 'Search';

interface SearchInputProps {
  className?: string;
  slug?: string;
}

const SearchInput = ({ className, slug }: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState('');
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { project, snootyEnv } = useSiteMetadata();
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const { search } = useLocation();
  const docsets = useAllDocsets();

  const keyPressHandler = useCallback(async (event: KeyboardEvent) => {
    // cmd+k or ctrl+k focuses search bar,
    // unless already focused on an input field
    const holdingCtrlCmd = (navigator.userAgent.includes('Mac') && event.metaKey) || event.ctrlKey;
    if (holdingCtrlCmd && event.key === 'k' && document.activeElement?.tagName.toLowerCase() !== 'input') {
      event.preventDefault();
      inputRef.current?.focus();
      return;
    }
  }, []);

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

  // get search url for staging and prod environments
  // all other environments will fall back to prod
  // considers localization as well
  const fullSearchUrl = useMemo(() => {
    const ENVS_WITH_SEARCH = ['dotcomstg', 'dotcomprd'];
    const targetEnv = ENVS_WITH_SEARCH.includes(snootyEnv) ? snootyEnv : ENVS_WITH_SEARCH[1];
    const landingDocset = docsets.find((d) => d.project === 'landing');
    return (
      assertTrailingSlash(landingDocset.url[targetEnv]) +
      localizePath(assertTrailingSlash(landingDocset.prefix[targetEnv]) + 'search')
    );
  }, [docsets, snootyEnv]);

  const onSubmit = () => {
    reportAnalytics('Search bar used', {
      type: 'docs-search',
      query: searchValue,
    });
    inputRef.current?.blur();
    if (project === 'landing' && slug === 'search') {
      const newSearch = new URLSearchParams();
      newSearch.set('q', searchValue);
      return navigate(`?${newSearch.toString()}`, { state: { searchValue } });
    }
    return (window.location.href = `${fullSearchUrl}/?q=${searchValue}`);
  };

  return (
    <StyledInputContainer className={cx(className)} mobileSearchActive={mobileSearchActive}>
      <StyledSearchBoxRef ref={searchBoxRef}>
        <LGSearchInput
          aria-label={PLACEHOLDER_TEXT}
          className={searchInputStyling({ mobileSearchActive })}
          value={searchValue}
          placeholder={isMobile ? PLACEHOLDER_TEXT_MOBILE : PLACEHOLDER_TEXT}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          onFocus={() => {
            reportAnalytics('Search bar focused');
          }}
          onSubmit={onSubmit}
          ref={inputRef}
        />
      </StyledSearchBoxRef>
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
      {!mobileSearchActive && (
        <IconButton
          aria-label={PLACEHOLDER_TEXT}
          className={searchIconStyling}
          onClick={() => {
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
