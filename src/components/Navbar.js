import React, { useCallback, useEffect, useState, useContext } from 'react';
import styled from '@emotion/styled';
import Link from './Link';
import Searchbar from './Searchbar';
import { SidenavContext, SidenavMobileMenuButton } from './Sidenav';
import DocsLogo from './SVGs/DocsLogo';
import { DOCS_URL } from '../constants';
import useMedia from '../hooks/use-media';
import { theme } from '../theme/docsTheme';
import { getSearchbarResultsFromJSON } from '../utils/get-searchbar-results-from-json';
import { searchParamsToURL } from '../utils/search-params-to-url';

const NavbarContainer = styled('div')`
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, ${(props) => (props.isTransparent ? '0.1' : '0.2')});
  display: flex;
  height: 45px;
  justify-content: space-between;
  padding: 0px 20px;
  position: relative;

  :focus {
    outline: none;
  }

  @media ${theme.screenSize.upToSmall} {
    justify-content: space-between;
  }
`;

const NavbarLeft = styled('div')`
  align-items: center;
  display: flex;
  ${(props) => props.isTransparent && 'opacity: 0.2;'}
`;

// TODO: Remove this component after consistent-nav is officially released
const Navbar = () => {
  // We want to expand the searchbar on default when it won't collide with any other nav elements
  // Specifically, the upper limit works around the Get MongoDB link
  const isSearchbarDefaultExpanded = useMedia('not all and (max-width: 670px)');
  const { isSidenavEnabled } = useContext(SidenavContext);
  const [isSearchbarExpanded, setIsSearchbarExpanded] = useState(isSearchbarDefaultExpanded);
  const [isTransparent, setIsTransparent] = useState(false);

  const onSearchbarExpand = useCallback(
    (isExpanded) => {
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

  useEffect(() => {
    setIsTransparent(isSearchbarExpanded && !isSearchbarDefaultExpanded);
  }, [isSearchbarDefaultExpanded, isSearchbarExpanded]);

  return (
    <NavbarContainer tabIndex="0" isTransparent={isTransparent}>
      {isSidenavEnabled && <SidenavMobileMenuButton />}
      <NavbarLeft isTransparent={isTransparent}>
        <Link to={`${DOCS_URL}/`}>
          <DocsLogo />
        </Link>
      </NavbarLeft>
      <Searchbar
        getResultsFromJSON={getSearchbarResultsFromJSON}
        isExpanded={isSearchbarExpanded}
        setIsExpanded={onSearchbarExpand}
        searchParamsToURL={searchParamsToURL}
        // Autofocus the searchbar when the user expands only so the user can start typing
        shouldAutofocus={!isSearchbarDefaultExpanded}
      />
    </NavbarContainer>
  );
};

export default Navbar;
