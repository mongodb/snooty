import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import Link from '../Link';
import { theme } from '../../theme/docsTheme';
import { DarkModeContext } from '../../context/dark-mode-context';

const LINK_DEPTH_PADDING = 16;

const listItemStyling = ({ isActive, darkMode }) => css`
  padding: 6px 0 6px 1px;

  &:hover,
  &:active {
    padding-left: 4px;
  }

  @media ${theme.screenSize.largeAndUp} {
    border-left-style: solid;
    border-left-width: ${isActive ? '2px' : '1px'};
    border-left-color: ${isActive
      ? darkMode
        ? // active & dark
          palette.gray.light1
        : // active & light
          palette.black
      : darkMode
      ? // inactive & dark
        palette.gray.dark2
      : // inactive & light
        palette.gray.light2};
    ${isActive && 'padding-left: 0;'}

    &:hover,
    &:active {
      border-left-width: 2px;
      border-left-color: ${darkMode ? palette.gray.light1 : palette.black};
      padding-left: 0;
    }
  }
`;

const linkStyling = ({ depth, isActive, darkMode }) => css`
  color: ${darkMode ? palette.gray.light2 : palette.black};
  font-size: ${theme.fontSize.small};
  line-height: ${theme.fontSize.default};
  font-weight: normal;

  ${isActive && ` font-weight: 600;`}

  display: inline-block;
  padding-left: ${`${depth * LINK_DEPTH_PADDING}px`};
  width: 100%;

  @media ${theme.screenSize.largeAndUp} {
    padding-left: calc(14px + ${depth * LINK_DEPTH_PADDING}px);
  }

  :hover,
  :active {
    color: currentColor;
    text-decoration: none;
  }
`;

const ContentsListItem = ({ children, depth = 0, id, isActive = false }) => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <li className={listItemStyling({ isActive, darkMode })}>
      <Link className={linkStyling({ depth, isActive, darkMode })} to={`#${id}`} depth={depth} isActive={isActive}>
        {children}
      </Link>
    </li>
  );
};

ContentsListItem.propTypes = {
  children: PropTypes.node,
  depth: PropTypes.number,
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

export default ContentsListItem;
