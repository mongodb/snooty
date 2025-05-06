import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { css } from '@leafygreen-ui/emotion';
import { gridStyling as landingTemplateGridStyling } from '../../templates/landing';
import { gridStyling as centerGridStyling } from '../../templates/NotFound';
import { theme } from '../../theme/docsTheme';
import { displayNone } from '../../utils/display-none';
import {
  DOCUMENT_TEMPLATE_MAX_WIDTH_VALUE,
  DOCUMENT_TEMPLATE_MAX_WIDTH_VALUE_LARGE_SCREEN,
} from '../../templates/document';
import { MAIN_COLUMN_HORIZONTAL_MARGIN } from '../MainColumn';

// default styling for all Action Bars
export const actionBarStyling = css`
  display: flex;
  height: 60px;
  padding-top: ${theme.size.small};
  padding-bottom: ${theme.size.small};
  position: sticky;
  top: 0;
  z-index: ${theme.zIndexes.actionBar};
  background-color: var(--background-color-primary);
  border-bottom: 1px solid var(--border-color);
  align-content: center;

  --border-color: ${palette.gray.light2};

  .dark-theme & {
    --border-color: ${palette.gray.dark2};
  }

  @media ${theme.screenSize.mediumAndUp} {
    & > div {
      flex: 0 1 auto;
    }
  }

  @media ${theme.screenSize.upToMedium} {
    justify-content: space-between;
    padding-right: 0;
  }
`;

// used for :template: options - 'product-landing', 'changelog'
const gridStyling = css`
  display: grid;
  grid-template-columns: minmax(${MAIN_COLUMN_HORIZONTAL_MARGIN}, 1fr) repeat(2, minmax(0, 600px)) minmax(
      ${MAIN_COLUMN_HORIZONTAL_MARGIN},
      1fr
    );

  @media ${theme.screenSize.upToLarge} {
    grid-template-columns: ${theme.size.medium} 1fr fit-content(100%);
  }
`;

// use strictly for :template: landing
const landingGridStyling = css`
  display: grid;
  ${landingTemplateGridStyling}
  @media ${theme.screenSize.upToLarge} {
    grid-template-columns: ${theme.size.medium} 1fr fit-content(100%);
  }
`;

const standardContentStyling = css`
  padding-left: max(
    calc(((100% - (${DOCUMENT_TEMPLATE_MAX_WIDTH_VALUE})) / 2) + ${MAIN_COLUMN_HORIZONTAL_MARGIN}),
    ${MAIN_COLUMN_HORIZONTAL_MARGIN}
  );

  @media ${theme.screenSize['3XLargeAndUp']} {
    padding-left: max(
      calc(((100% - (${DOCUMENT_TEMPLATE_MAX_WIDTH_VALUE_LARGE_SCREEN})) / 2) + ${MAIN_COLUMN_HORIZONTAL_MARGIN}),
      ${MAIN_COLUMN_HORIZONTAL_MARGIN}
    );
  }

  @media ${theme.screenSize.upToLarge} {
    padding-left: ${theme.size.medium};
  }
`;

const flexStyling = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: nowrap;
  padding-left: ${MAIN_COLUMN_HORIZONTAL_MARGIN};
  @media ${theme.screenSize.upToLarge} {
    padding-left: ${theme.size.medium};
  }
`;

const middleAlignment = css`
  display: grid;
  ${centerGridStyling}

  @media ${theme.screenSize.upToMedium} {
    grid-template-columns: repeat(12, 1fr);
  }
`;

const leftInGrid = css`
  grid-column: 2/-2;

  @media ${theme.screenSize.upToLarge} {
    grid-column: 2/-3;
    padding-right: 0;
  }
  @media ${theme.screenSize.largeAndUp} {
    grid-column: 2/-8;
  }
  @media ${theme.screenSize.xLargeAndUp} {
    grid-column: 2/-7;
  }
`;

const centerInGrid = css`
  grid-column: 6/-5;

  @media ${theme.screenSize.upToXLarge} {
    grid-column: 4/-6;
  }

  @media ${theme.screenSize.upToLarge} {
    grid-column: 3/-8;
  }
  @media ${theme.screenSize.upToMedium} {
    grid-column: 3/-2;
  }
`;

export const getContainerStyling = (template) => {
  let containerClassname,
    searchContainerClassname,
    fakeColumns = false;

  switch (template) {
    case 'landing':
      containerClassname = landingGridStyling;
      searchContainerClassname = leftInGrid;
      fakeColumns = true;
      break;
    case 'product-landing':
    case 'changelog':
      containerClassname = gridStyling;
      fakeColumns = true;
      break;
    case 'blank':
    case 'errorpage':
      containerClassname = middleAlignment;
      searchContainerClassname = centerInGrid;
      fakeColumns = true;
      break;
    case 'drivers-index':
    case 'guide':
    case 'search':
      containerClassname = flexStyling;
      break;
    default:
      containerClassname = standardContentStyling;
      break;
  }

  return { containerClassname, fakeColumns, searchContainerClassname };
};

export const ActionBarSearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: inherit;

  @media ${theme.screenSize.mediumAndUp} {
    padding-right: ${theme.size.default};
  }

  @media ${theme.screenSize.upToLarge} {
    max-width: unset;
    justify-content: space-between;
    width: 100%;
  }
`;

export const StyledInputContainer = styled.div`
  width: 100%;
  max-width: 610px;
  background: inherit;

  div[role='searchbox'] {
    background-color: var(--search-input-background-color);
    width: 100%;
  }

  --search-input-background-color: ${palette.white};
  .dark-theme & {
    --search-input-background-color: ${palette.gray.dark4};
  }

  @media ${theme.screenSize.mediumAndUp} {
    width: ${({ sidenav }) => (sidenav ? '70' : '100')}%;
  }

  ${(props) => {
    return (
      props.mobileSearchActive &&
      `
      display: flex !important;
      position: absolute;
      width: calc(100% - ${theme.size.medium} - ${theme.size.medium});
      z-index: 40;
      max-width: unset;
      left: ${theme.size.medium};
      column-gap: ${theme.size.medium};

      form {
        width: 100%;
        margin-right: ${theme.size.medium};
      }
    `
    );
  }}
`;

// Used to ensure dropdown is same width as input
export const StyledSearchBoxRef = styled.div`
  width: 100%;
`;

export const searchInputStyling = ({ mobileSearchActive }) => css`
  ${displayNone.onMedium};

  @media ${theme.screenSize.upToMedium} {
    input[type='search'] {
      font-size: ${theme.fontSize.default};
    }
  }

  ${mobileSearchActive &&
  `
    display: flex !important;
    width: calc(100% - ${theme.size.medium} - ${theme.size.medium});
    z-index: 40;
    max-width: unset;
    background: var(--background-color-primary);
    align-items: center;

    > form {
      width: 100%;
      margin-right: ${theme.size.medium};
    }
  `}
`;
export const ActionsBox = styled('div')`
  display: flex;
  align-items: center;
  column-gap: ${theme.size.default};
  position: relative;
  top: 0;
  margin: 0 ${theme.size.large} 0 ${theme.size.medium};
  justify-self: flex-end;
  grid-column: -2/-1;

  @media ${theme.screenSize.upToLarge} {
    column-gap: 6px;
    margin-right: ${theme.size.medium};
    margin-left: ${theme.size.small};
  }

  @media ${theme.screenSize.upToMedium} {
    margin-left: 1px;
  }
`;

export const overlineStyling = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${palette.gray.dark1};
  text-transform: uppercase;
  text-wrap: nowrap;
  font-weight: 600;
  cursor: pointer;
  ${displayNone.onLargerThanTablet};
  font-size: ${theme.fontSize.tiny};
  padding-right: ${theme.size.large};
  .dark-theme & {
    color: ${palette.gray.light2};
  }

  > svg {
    margin-right: ${theme.size.small};
  }
`;

export const searchIconStyling = css`
  ${displayNone.onLargerThanMedium};
  float: right;
  justify-content: right;
`;

export const offlineStyling = css`
  @media ${theme.screenSize.largeAndUp} {
    display: none;
  }
`;

const hideOnEnLang = `
  &:not(:lang(EN)) {
    display: none;
  }
`;

export const chatbotButtonStyling = css`
  text-wrap-mode: nowrap;
  ${displayNone.onMobileAndTablet};
  ${hideOnEnLang}
`;

export const chatbotMobileButtonStyling = css`
  ${displayNone.onLargerThanTablet}
  ${hideOnEnLang}
  color: ${palette.green.dark2};

  .dark-theme & {
    color: ${palette.green.dark1};
  }
`;
