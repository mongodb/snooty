import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import { formatText } from '../utils/format-text';
import useScreenSize from '../hooks/useScreenSize.js';
import { ContentsContext } from './contents-context';
import { Label } from './Select';
import Link from './Link';
import { theme } from '../theme/docsTheme';

const activeBorderLeftCSS = css`
  border-left: 2px solid ${uiColors.gray.dark3};
  padding-left: 0;
`;

const listItemColor = uiColors.black;

const ListItem = styled('li')`
  @media ${theme.screenSize.mediumAndUp} {
    ${(props) => (props.isActive ? activeBorderLeftCSS : `border-left: 1px solid ${uiColors.gray.light2};`)}

    &:hover,
    &:active {
      ${activeBorderLeftCSS}
    }
  }

  padding: 6px 0 6px 1px;
  width: ${(props) => props.figwidth};

  &:hover,
  &:active {
    padding-left: 4px;
  }
`;

const StyledLink = styled(Link)`
  color: ${listItemColor};
  display: inline-block;
  padding-left: ${(props) => `${props.depth - 2}` + '* 16px'}
  width: 100%;
  @media ${theme.screenSize.mediumAndUp} {
    ${(props) => `padding-left: calc(14px + ${props.depth - 2} * 16px)`};
  }
  :hover {
    color: ${listItemColor};
    text-decoration: none;
  }
`;

const ContentsList = styled('ul')`
  list-style-type: none;
  padding: 0;
`;

const ContentsListItem = ({ children, depth, id, isActive }) => (
  <ListItem isActive={isActive}>
    <StyledLink to={`#${id}`} isActive={isActive} depth={depth}>
      {children}
    </StyledLink>
  </ListItem>
);

ContentsListItem.propTypes = {
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  depth: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

const formatTextOptions = {
  literalEnableInline: true,
};

const Contents = ({ inRightColumn }) => {
  const { headingNodes, activeHeadingId } = useContext(ContentsContext);

  if (headingNodes.length === 0) {
    return null;
  }

  return (
    { inRightColumn } && (
      <>
        <Label>On this page</Label>
        <ContentsList>
          {headingNodes.map(({ depth, id, title }, index) => (
            <ContentsListItem depth={depth} key={id} id={id} isActive={activeHeadingId === id}>
              {formatText(title, formatTextOptions)}
            </ContentsListItem>
          ))}
        </ContentsList>
      </>
    )
  );
};

export default Contents;
