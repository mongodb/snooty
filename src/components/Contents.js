import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { formatText } from '../utils/format-text';
import { ContentsContext } from './contents-context';

const CONTENT_LIST_ITEM_SHAPE = {
  depth: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const activeBorderLeftCSS = css`
  & > .activeSection,
  li:hover,
  li:active {
    border-left: 2px solid #21313c;
  }
`;

const listItemColor = '#061621';

const chooseFontSize = inRightColumn => {
  return inRightColumn ? '14px' : '16px';
};

const ContentsListItem = ({ id, title, depth, activeSection, inRightColumn }) => (
  <li
    className={activeSection ? 'activeSection' : ''}
    css={css`
      list-style-type: none;
      ${inRightColumn ? 'border-left: 1px solid #E7EEEC;' : ''}
      margin-left: -16px;
      padding: 3px 0px;
    `}
  >
    <a
      href={`#${id}`}
      css={css`
        color: ${listItemColor};
        display: inline-block;
        font-size: ${chooseFontSize(inRightColumn)};
        line-height: 19px;
        // Heading sections should begin at depth 2
        padding-left: calc(${inRightColumn ? '14px +' : ''} ${depth - 2} * 16px);
        width: 100%;

        :hover {
          color: ${listItemColor};
          text-decoration: none;
        }
      `}
    >
      {formatText(title)}
    </a>
  </li>
);

ContentsListItem.propTypes = {
  activeSection: PropTypes.bool.isRequired,
  depth: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  inRightColumn: PropTypes.bool.isRequired,
  title: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const ContentsList = ({ activeSectionIndex, listItems, inRightColumn }) => (
  <ul
    css={css`
      margin-left: -20px;

      ${inRightColumn ? activeBorderLeftCSS : ''}
    `}
  >
    {listItems.map(({ depth, id, title }, index) => (
      <ContentsListItem
        depth={depth}
        id={id}
        key={index}
        title={title}
        activeSection={activeSectionIndex == index}
        inRightColumn={inRightColumn}
      />
    ))}
  </ul>
);

ContentsList.propTypes = {
  activeSectionIndex: PropTypes.number.isRequired,
  listItems: PropTypes.arrayOf(PropTypes.shape(CONTENT_LIST_ITEM_SHAPE)).isRequired,
  inRightColumn: PropTypes.bool.isRequired,
};

const Contents = ({ inRightColumn }) => {
  const displayText = 'On This Page';
  const { headingNodes, activeSectionIndex } = useContext(ContentsContext);

  return (
    <React.Fragment>
      {headingNodes.length > 0 && (
        <div
          css={css`
            padding-right: 36px;
            overflow-y: auto;
          `}
        >
          <p
            css={css`
              color: #3d4f58;
              font-size: ${chooseFontSize(inRightColumn)};
              font-weight: bold;
              letter-spacing: 0.5px;
              line-height: 16px;
            `}
          >
            {displayText.toUpperCase()}
          </p>
          <ContentsList
            listItems={headingNodes}
            activeSectionIndex={activeSectionIndex}
            inRightColumn={inRightColumn}
          />
        </div>
      )}
    </React.Fragment>
  );
};

Contents.propTypes = {
  inRightColumn: PropTypes.bool,
};

Contents.defaultProps = {
  inRightColumn: false,
};

export default Contents;
