import React, { useCallback, useEffect, useState } from 'react';
import { withPrefix } from 'gatsby';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import useMedia from '../hooks/use-media';
import { getSearchbarResultsFromJSON } from '../utils/get-searchbar-results-from-json';
import { searchParamsToURL } from '../utils/search-params-to-url';
import Searchbar from './Searchbar';
import { theme } from '../theme/docsTheme';
import SidebarMobileMenuButton from './SidebarMobileMenuButton';

const NavbarContainer = styled('div')`
  ${({ isExpanded, shouldOpaqueWhenExpanded }) => isExpanded && shouldOpaqueWhenExpanded && 'opacity: 0.2;'};

  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  height: 45px;
  justify-content: flex-start;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9999;

  @media ${theme.screenSize.upToSmall} {
    justify-content: space-evenly;
  }
`;

const NavbarLeft = styled('div')`
  align-items: center;
  display: flex;
  padding-left: 20px;

  @media ${theme.screenSize.upToSmall} {
    padding-left: 0px;
  }
`;

const NavSeparator = styled('span')`
  background-color: #616161;
  display: inline-block;
  height: 16px;
  margin: 0 6px;
  width: 1px;
`;

const NavLabel = styled('div')`
  color: #616161;
  display: inline-block;
  font-family: Akzidenz;
  font-size: 16px;
  user-select: none;
`;

const Navbar = () => {
  // We want to expand the searchbar on default when it won't collide with any other nav elements
  // Specifically, the upper limit works around the Get MongoDB link
  const isSearchbarDefaultExpanded = useMedia('not all and (max-width: 670px)');
  const [isSearchbarExpanded, setIsSearchbarExpanded] = useState(isSearchbarDefaultExpanded);

  const onSearchbarExpand = useCallback(
    isExpanded => {
      // On certain screens the searchbar is never collapsed
      if (!isSearchbarDefaultExpanded) {
        setIsSearchbarExpanded(isExpanded);
      }
    },
    [isSearchbarDefaultExpanded]
  );

  useEffect(() => {
    setIsSearchbarExpanded(isSearchbarDefaultExpanded);
  }, [isSearchbarDefaultExpanded]);

  return (
    <NavbarContainer
      isExpanded={isSearchbarExpanded}
      shouldOpaqueWhenExpanded={!isSearchbarDefaultExpanded}
      tabIndex="0"
    >
      <SidebarMobileMenuButton />
      <NavbarLeft>
        <a href="https://mongodb.com">
          <img
            css={css`
              height: 23px;
              width: 90px;
            `}
            alt="MongoDB Logo"
            src={withPrefix('assets/mongodb-logo.png')}
          />
        </a>
        <NavSeparator></NavSeparator>
        <NavLabel>Documentation</NavLabel>
      </NavbarLeft>
      <div>
        <Searchbar
          getResultsFromJSON={getSearchbarResultsFromJSON}
          isExpanded={isSearchbarExpanded}
          setIsExpanded={onSearchbarExpand}
          searchParamsToURL={searchParamsToURL}
          // Autofocus the searchbar when the user expands only so the user can start typing
          shouldAutofocus={!isSearchbarDefaultExpanded}
        />
      </div>
    </NavbarContainer>
  );
};

export default Navbar;
