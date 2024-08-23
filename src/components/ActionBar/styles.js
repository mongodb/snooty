import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import { css } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import { CONTENT_MAX_WIDTH } from '../../templates/product-landing';
import { displayNone } from '../../utils/display-none';

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
  grid-template-columns: minmax(${theme.size.xlarge}, 1fr) minmax(0, ${CONTENT_MAX_WIDTH}px) fit-content(100%);

  @media ${theme.screenSize.upToLarge} {
    grid-template-columns: 48px 1fr fit-content(100%);
  }
  @media ${theme.screenSize.upToMedium} {
    grid-template-columns: ${theme.size.medium} 1fr fit-content(100%);
  }
`;

// use strictly for :template: landing
const landingGridStyling = css`
  display: grid;
  grid-template-columns: minmax(${theme.size.xlarge}, 1fr) minmax(0, ${theme.breakpoints.xxLarge}px) minmax(
      ${theme.size.xlarge},
      1fr
    );
  @media ${theme.screenSize.upToLarge} {
    grid-template-columns: ${theme.size.medium} 1fr fit-content(100%);
  }
`;

const flexStyling = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: nowrap;
  padding-left: ${theme.size.xlarge};
  @media ${theme.screenSize.upToLarge} {
    padding-left: ${theme.size.medium};
  }
`;

const middleAlignment = css`
  display: grid;
  grid-template-columns: ${theme.size.xlarge} repeat(12, minmax(0, 1fr)) ${theme.size.xlarge};
`;

const centerInGrid = css`
  grid-column: 4/-4;

  @media ${theme.screenSize.upToMedium} {
    grid-column: 2/-2;
  }
  @media ${theme.screenSize.upToLarge} {
    grid-column: 3/-3;
  }
  @media ${theme.screenSize.largeAndUp} {
    grid-column: 4/-4;
  }
  @media ${theme.screenSize.xLargeAndUp} {
    grid-column: 5/-5;
  }
`;

export const getContainerStyling = (template) => {
  let containerClassname,
    searchContainerClassname,
    fakeColumns = false;
  switch (template) {
    case 'product-landing':
      containerClassname = gridStyling;
      fakeColumns = true;
      break;
    case 'landing':
      containerClassname = landingGridStyling;
      fakeColumns = true;
      break;
    case 'changelog':
      containerClassname = gridStyling;
      fakeColumns = true;
      break;
    case 'blank':
      containerClassname = middleAlignment;
      searchContainerClassname = centerInGrid;
      fakeColumns = true;
      break;
    case 'errorpage':
      containerClassname = middleAlignment;
      searchContainerClassname = centerInGrid;
      fakeColumns = true;
      break;
    default:
      containerClassname = flexStyling;
      break;
  }

  return { containerClassname, fakeColumns, searchContainerClassname };
};

export const ActionBarSearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  background: inherit;

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
    padding-right: ${theme.size.medium};
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

      > form {
        width: 100%;
        margin-right: ${theme.size.medium};
      }
    `
    );
  }}
`;

export const searchInputStyling = ({ mobileSearchActive }) => {
  console.log({ mobileSearchActive });
  return css`
    ${displayNone.onMedium};
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
};

export const ActionsBox = styled('div')`
  display: flex;
  align-items: center;
  column-gap: ${theme.size.default};
  position: relative;
  top: 0;
  padding-right: ${theme.size.large};
  justify-self: flex-end;
  grid-column: -2/-1;

  @media ${theme.screenSize.upToLarge} {
    padding-right: ${theme.size.medium};
  }

  @media ${theme.screenSize.upToMedium} {
    padding-left: ${theme.size.small};
    column-gap: ${theme.size.small};
  }
`;

export const MobileStyledLink = styled.a`
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
`;

// using content before/after to prevent event bubbling up from lg/search-input/search-result
// package above gets all text inside node, and sets the value of Input node of all text within search result:
// https://github.com/mongodb/leafygreen-ui/blob/%40leafygreen-ui/search-input%402.1.4/packages/search-input/src/SearchInput/SearchInput.tsx#L149-L155
export const suggestionStyling = ({ copy }) => css`
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
