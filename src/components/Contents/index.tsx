import React, { useContext } from 'react';
import { isEmpty } from 'lodash';
import { formatText } from '../../utils/format-text';
import { HeadingNodeSelectorIds } from '../../types/ast';
import { ActiveSelectorIds, ContentsContext } from './contents-context';
import ContentsList from './ContentsList';
import ContentsListItem from './ContentsListItem';

const formatTextOptions = {
  literalEnableInline: true,
};

/* recursively go through selector ids defined by parser
everything in headingSelectorIds must be present in activeSelectorIds
activeSelectorIds structure:
{
  methodSelector?: str,
  tab?: [str],
}
headingSelectorIds structure (comes from parser):
{
  method-option | tab: str,
  children?: {
    tab: str,
    children?: {
      tab: str,
      ...
    }
  }
} 
*/
const isHeadingVisible = (
  headingSelectorIds: HeadingNodeSelectorIds,
  activeSelectorIds: ActiveSelectorIds
): boolean => {
  if (!headingSelectorIds || isEmpty(headingSelectorIds)) return true;
  const headingsMethodParent = headingSelectorIds['method-option'];
  const headingsTabParent = headingSelectorIds['tab'];
  if (
    (headingsMethodParent && headingsMethodParent !== activeSelectorIds.methodSelector) ||
    (headingsTabParent && !activeSelectorIds.tab?.includes(headingsTabParent))
  ) {
    return false;
  }
  return isHeadingVisible(headingSelectorIds.children ?? {}, activeSelectorIds);
};

const Contents = ({ className }: { className: string }) => {
  const { activeHeadingId, headingNodes, showContentsComponent, activeSelectorIds } = useContext(ContentsContext);

  const filteredNodes = headingNodes.filter((headingNode) => {
    return isHeadingVisible(headingNode.selector_ids, activeSelectorIds);
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

export default Contents;
