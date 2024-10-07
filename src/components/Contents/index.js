import React, { useContext } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { formatText } from '../../utils/format-text';
import { ContentsContext } from './contents-context';
import ContentsList from './ContentsList';
import ContentsListItem from './ContentsListItem';

const formatTextOptions = {
  literalEnableInline: true,
};

// recursively go through selector ids defined by parser
// everything in headingSelectorIds must be present in activeSelectorIds
const checkNodes = (headingSelectorIds, activeSelectorIds) => {
  if (!headingSelectorIds || isEmpty(headingSelectorIds)) return true;
  if (headingSelectorIds['method-option'] && headingSelectorIds['method-option'] !== activeSelectorIds.methodSelector) {
    return false;
  }
  if (headingSelectorIds['tab'] && !activeSelectorIds.tab?.includes(headingSelectorIds['tab'])) {
    return false;
  }
  return checkNodes(headingSelectorIds.children ?? {}, activeSelectorIds);
};

const Contents = ({ className }) => {
  const { activeHeadingId, headingNodes, showContentsComponent, activeSelectorIds } = useContext(ContentsContext);

  const filteredNodes = headingNodes.filter((headingNode) => {
    return checkNodes(headingNode.selector_ids, activeSelectorIds);
  });

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
