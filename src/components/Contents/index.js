import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { formatText } from '../../utils/format-text';
import { ContentsContext } from './contents-context';
import ContentsList from './ContentsList';
import ContentsListItem from './ContentsListItem';

const formatTextOptions = {
  literalEnableInline: true,
};

const Contents = ({ className }) => {
  const { activeHeadingId, headingNodes, showContentsComponent, activeSelectorId } = useContext(ContentsContext);

  // Don't filter if selector_id is null/undefined
  const filteredNodes = headingNodes.filter(
    (headingNode) => !headingNode.selector_id || headingNode.selector_id === activeSelectorId
  );

  if (filteredNodes.length === 0 || !showContentsComponent) {
    return null;
  }

  const label = 'On this page';

  return (
    <div className={className}>
      <ContentsList label={label}>
        {filteredNodes.map(({ depth, id, title }) => {
          // Depth of heading nodes refers to their depth in the AST
          const listItemDepth = Math.max(depth - 2, 0);
          return (
            <ContentsListItem depth={listItemDepth} key={id} id={id} isActive={activeHeadingId === id}>
              {formatText(title, formatTextOptions)}
            </ContentsListItem>
          );
        })}
      </ContentsList>
    </div>
  );
};

Contents.propTypes = {
  className: PropTypes.string,
};

export default Contents;
