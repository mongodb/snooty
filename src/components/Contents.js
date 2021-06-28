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
    border-left: ${(props) =>
      props.isActive ? '1px solid ${uiColors.gray.light2}' : '1px solid ${uiColors.gray.light2}'};
    padding-left: ${(props) => (props.isActive ? '0' : '')};
    
    &:hover,
    &:active {
      activeBorderLeftCSS
    }
  }
  
  padding: 6px 0 6px 1px;
  width: ${(props) => props.figwidth};

  &:hover,
  &:active {
    'padding-left: 4px;'
  }
`;

const ContentsListItem = ({ children, depth, id, isActive }) => (
  <ListItem isActive={isActive}>
    <Link
      to={`#${id}`}
      css={css`
        /* TODO: Remove when mongodb-docs.css is removed */
        color: ${listItemColor};
        display: inline-block;
        /* Heading sections should begin at depth 2 */
        @media ${theme.screenSize.mediumAndUp} {
          padding-left: calc($14px +' ${depth - 2} * 16px);
        }
        padding-left: calc(${depth - 2} * 16px);
        width: 100%;

        :hover {
          color: ${listItemColor};
          text-decoration: none;
        }
      `}
    >
      {children}
    </Link>
  </ListItem>
);

ContentsListItem.propTypes = {
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  depth: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

const ContentsList = styled('ul')`
  @media ${theme.screenSize.mediumAndUp} {
    display: ${(props) => (props.shouldShowDesktop ? '' : 'none')};
  }
  list-style-type: none;
  padding: 0;
`;

const formatTextOptions = {
  literalEnableInline: true,
};

const Contents = ({ shouldShowDesktop }) => {
  const { headingNodes, activeHeadingId } = useContext(ContentsContext);

  if (headingNodes.length === 0) {
    return null;
  }

  return (
    <>
      <Label>On this page</Label>
      <ContentsList shouldShowDesktop={shouldShowDesktop}>
        {headingNodes.map(({ depth, id, title }, index) => (
          <ContentsListItem depth={depth} key={id} id={id} isActive={activeHeadingId === id}>
            {formatText(title, formatTextOptions)}
          </ContentsListItem>
        ))}
      </ContentsList>
    </>
  );
};

export default Contents;
