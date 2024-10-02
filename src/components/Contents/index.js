import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { formatText } from '../../utils/format-text';
import { ContentsContext } from './contents-context';
import ContentsList from './ContentsList';
import ContentsListItem from './ContentsListItem';

const formatTextOptions = {
  literalEnableInline: true,
};

// recursively go through header nodes and make sure present
// everything in headingSelectorIds must be present in activeSelectorIds
const checkNodes = (headingSelectorIds, activeSelectorIds) => {
  console.log('HEADING NODES HERE', headingSelectorIds);
  if (!headingSelectorIds || JSON.stringify(headingSelectorIds) === '{}') return true;
  if (headingSelectorIds['method-option'] && headingSelectorIds['method-option'] !== activeSelectorIds.methodSelector) {
    console.log('REATURNING FALSE IN METHOD', headingSelectorIds['method-option'], activeSelectorIds.methodSelector);
    return false;
  }
  if (headingSelectorIds['tab'] && !activeSelectorIds.tab?.includes(headingSelectorIds['tab'])) {
    console.log('RETURN INF FALSE IN TAB ', headingSelectorIds['tab'], activeSelectorIds.tab);
    return false;
  }
  console.log('HEADLLO', headingSelectorIds.children);
  return checkNodes(headingSelectorIds.children ?? {}, activeSelectorIds);
};

const Contents = ({ className }) => {
  const { activeHeadingId, headingNodes, showContentsComponent, activeSelectorIds } = useContext(ContentsContext);

  console.log('heading nodes', headingNodes);
  console.log('Active selector ids', activeSelectorIds);

  const filteredNodes = headingNodes.filter((headingNode) => {
    console.log('STARTING FILTERING FOR ', headingNode);
    const a = checkNodes(headingNode.selector_ids, activeSelectorIds);
    console.log('CHECK NODES FOR', headingNode, ' WHICH IS ', a);
    return a;
  });
  console.log('FILTERED NODES', filteredNodes);

  // console.log('HNODE', headingNode.selector_ids);
  // console.log('active selector id', activeSelectorIds.methodSelector);
  // return headingNode.selector_ids.includes({ 'method-option': activeSelectorIds.methodSelector });

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
