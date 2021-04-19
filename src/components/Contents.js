import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import useScreenSize from '../hooks/useScreenSize.js';
import { ContentsContext } from './contents-context';
import ComponentFactory from './ComponentFactory';
import { Label } from './Select';
import Link from './Link';

const activeBorderLeftCSS = css`
  border-left: 2px solid ${uiColors.gray.dark3};
  padding-left: 0;
`;

const listItemColor = uiColors.black;

const ContentsListItem = ({ children, depth, id, isActive, isDesktopOrLaptop }) => (
  <li
    css={css`
      padding: 6px 0 6px 1px;
      ${isDesktopOrLaptop ? `border-left: 1px solid ${uiColors.gray.light2};` : ''}
      ${isDesktopOrLaptop && isActive ? activeBorderLeftCSS : ''};

      &:hover,
      &:active {
        ${isDesktopOrLaptop ? activeBorderLeftCSS : 'padding-left: 4px;'}
      }
    `}
  >
    <Link
      to={`#${id}`}
      css={css`
        /* TODO: Remove when mongodb-docs.css is removed */
        color: ${listItemColor};
        display: inline-block;
        /* Heading sections should begin at depth 2 */
        padding-left: calc(${isDesktopOrLaptop ? '14px +' : ''} ${depth - 2} * 16px);
        width: 100%;

        :hover {
          color: ${listItemColor};
          text-decoration: none;
        }
      `}
    >
      {children}
    </Link>
  </li>
);

ContentsListItem.propTypes = {
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  depth: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

const ContentsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Contents = () => {
  const { headingNodes, activeHeadingId } = useContext(ContentsContext);
  const { isTabletOrMobile } = useScreenSize();

  if (headingNodes.length === 0) {
    return null;
  }

  return (
    <>
      <Label>On this page</Label>
      <ContentsList>
        {headingNodes.map(({ depth, id, title }, index) => (
          <ContentsListItem
            depth={depth}
            key={id}
            id={id}
            isActive={activeHeadingId === id}
            isDesktopOrLaptop={!isTabletOrMobile}
          >
            {title.map((node, i) => (
              <ComponentFactory nodeData={node} key={`${index}-${i}`} />
            ))}
          </ContentsListItem>
        ))}
      </ContentsList>
    </>
  );
};

export default Contents;
