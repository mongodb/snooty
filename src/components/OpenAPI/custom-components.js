import React from 'react';
import { render } from 'react-dom';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { MENU_CONTENT_CLASS, MENU_TITLE_CONTAINER_CLASS } from './constants';
import { SidenavBackButton } from '../Sidenav';
import { theme } from '../../theme/docsTheme';

const MenuTitle = styled('div')`
  color: ${palette.gray.dark3};
  font-size: ${theme.fontSize.small};
  font-weight: bold;
  line-height: 20px;
  margin: ${theme.size.medium} ${theme.size.default};
  text-transform: capitalize;
`;

const Border = styled('hr')`
  border: unset;
  border-bottom: 1px solid ${palette.gray.light2};
  margin: ${theme.size.default} 0;
  width: 100%;
`;

const MenuTitleContainer = ({ siteTitle, pageTitle }) => {
  const docsTitle = siteTitle ? `${siteTitle} Docs` : 'Docs';
  return (
    <>
      {/* Disable LG left arrow glyph due to bug where additional copies of the LG icon would be rendered 
          at the bottom of the page. */}
      <SidenavBackButton border={<Border />} enableGlyph={false} target="/" titleOverride={docsTitle} />
      <MenuTitle>{pageTitle}</MenuTitle>
    </>
  );
};

// Injects custom components to Redoc component. Intended to be used after initial render.
export const injectCustomComponents = (pageTitle, siteTitle) => {
  // Don't inject anything if menu title container already exists.
  const menuTest = document.querySelector(`.${MENU_TITLE_CONTAINER_CLASS}`);
  if (menuTest) return;

  const sidebarEl = document.querySelector(`.${MENU_CONTENT_CLASS}`);
  if (!sidebarEl) return;
  const searchEl = document.querySelector('div[role="search"]');
  if (!searchEl) return;

  // Insert back button and page title to redoc's sidenav
  const menuTitleContainerEl = document.createElement('div');
  menuTitleContainerEl.className = MENU_TITLE_CONTAINER_CLASS;
  sidebarEl.insertBefore(menuTitleContainerEl, searchEl);
  render(<MenuTitleContainer siteTitle={siteTitle} pageTitle={pageTitle} />, menuTitleContainerEl);
};
