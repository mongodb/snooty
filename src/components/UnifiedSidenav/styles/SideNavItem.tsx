import { css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../../theme/docsTheme';

export const sideNavItemBasePadding = css`
  /* overwrite LG link underlines @leafygreen-ui/typography v13.0.0 */
  &:hover {
    &:after,
    span:after {
      display: none;
    }
  }
`;

export const l1ItemStyling = ({ isActive, isAccordion }: { isActive: boolean; isAccordion: boolean }) => css`
  ${sideNavItemBasePadding}
  padding-left: ${theme.size.medium};
  padding-right: ${theme.size.medium};
  padding-top: ${theme.size.default};
  padding-bottom: ${theme.size.default};
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;

  /* Makes sure the color of the active tab isn't blue before selected */
  ::before {
    color: var(--sidenav-active-before-color);
  }

  ${isActive &&
  css`
    font-weight: 600 !important;

    ${isAccordion
      ? css`
          /* Hides the left tab on Active Selection */
          &[aria-current='page'] {
            background-color: unset;
            color: unset;
            :hover {
              background-color: var(--sidenav-hover-bg-color);
            }
          }

          ::before {
            display: none;
          }
        `
      : css`
          color: var(--sidenav-active-before-color) !important;
          background-color: ${palette.green.light3};

          .dark-theme & {
            background-color: ${palette.green.dark3};
          }
        `}
  `}
`;

export const groupHeaderStyling = ({ isAccordion }: { isAccordion: boolean }) => css`
  div > div {
    ${isAccordion &&
    css`
      padding-left: 4px;
      button {
        margin-left: -8px;
      }
    `}
    font-weight: 500;
    color: var(--tab-color-primary);
  }

  /* Version Dropdown button */
  button {
    margin-left: ${!isAccordion && '-8px'};
    height: 28px;
  }
`;

export const l2ItemStyling = ({ level, isAccordion }: { level: number; isAccordion: boolean }) => css`
  ${sideNavItemBasePadding}
  line-height: 20px;
  font-size: ${theme.fontSize.small};
  ${isAccordion
    ? css`
        padding-left: calc(50px + ${(level - 1) * 25}px);
      `
    : css`
        padding-left: calc(${theme.size.default} + ${(level - 1) * 25}px);
      `}

  /* Hides the left tab on Active Selection */
  
  ${isAccordion
    ? css`
        &[aria-current='page'] {
          color: var(--sidenav-active-before-color) !important;
          background-color: var(--sidenav-active-bg-color);
        }
      `
    : css`
        &[aria-current='page'] {
          font-weight: 400;
          color: var(--font-color-active) !important;
          background-color: var(--sidenav-active-bg-color);
        }

        ::before {
          display: none;
        }
      `}
`;
