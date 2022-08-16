import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import Link from '../Link';
import { theme } from '../../theme/docsTheme';

const LINK_DEPTH_PADDING = 16;

const activeBorderLeftCSS = css`
  border-left: 2px solid ${palette.black};
  padding-left: 0;
`;

const ListItem = styled('li')`
  padding: 6px 0 6px 1px;

  &:hover,
  &:active {
    padding-left: 4px;
  }

  @media ${theme.screenSize.largeAndUp} {
    ${({ isActive }) => (isActive ? activeBorderLeftCSS : `border-left: 1px solid ${palette.gray.light2};`)}

    &:hover,
    &:active {
      ${activeBorderLeftCSS}
    }
  }
`;

const StyledLink = styled(Link)`
  color: ${palette.black};
  font-size: ${theme.fontSize.small};
  line-height: ${theme.fontSize.default};

  ${({ isActive }) => (isActive ? `font-weight: 600;` : `font-weight: normal;`)}

  display: inline-block;
  padding-left: ${({ depth }) => `${depth * LINK_DEPTH_PADDING}px`};
  width: 100%;

  @media ${theme.screenSize.largeAndUp} {
    padding-left: calc(14px + ${({ depth }) => depth * LINK_DEPTH_PADDING}px);
  }

  :hover,
  :active {
    color: currentColor;
    text-decoration: none;
  }
`;

const ContentsListItem = ({ children, depth = 0, id, isActive = false }) => {
  return (
    <ListItem isActive={isActive}>
      <StyledLink to={`#${id}`} depth={depth} isActive={isActive}>
        {children}
      </StyledLink>
    </ListItem>
  );
};

ContentsListItem.propTypes = {
  children: PropTypes.node,
  depth: PropTypes.number,
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

export default ContentsListItem;
