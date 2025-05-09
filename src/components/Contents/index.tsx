import React, { useContext } from 'react';
import { isEmpty } from 'lodash';
import { cx, css } from '@leafygreen-ui/emotion';

import { useLocation } from '@gatsbyjs/reach-router';
import FeedbackRating from '../Widgets/FeedbackWidget';
import { formatText } from '../../utils/format-text';
import { HeadingNodeSelectorIds } from '../../types/ast';
import { theme } from '../../theme/docsTheme';
import useScreenSize from '../../hooks/useScreenSize';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import ContentsList from './ContentsList';
import ContentsListItem from './ContentsListItem';
import { type ActiveSelectorIds, ContentsContext } from './contents-context';

const formatTextOptions = {
  literalEnableInline: true,
};

const formContainer = css`
  @media ${theme.screenSize.tablet} {
    z-index: 1;
  }
`;

const formStyle = css`
  position: absolute;
  right: 0;
  margin-top: ${theme.size.tiny};

  @media ${theme.screenSize.upToLarge} {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
`;

const styledContentList = css`
  overflow: auto;
  height: 90%;
`;

export const DEPRECATED_PROJECTS = ['atlas-app-services', 'datalake', 'realm'];

/* recursively go through selector ids defined by parser
everything in headingSelectorIds must be present in activeSelectorIds
activeSelectorIds structure:
{
  methodSelector?: str,
  tab?: [str],
}
headingSelectorIds structure (comes from parser):
{
  method-option | tab | selected-content: str,
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
  activeSelectorIds: ActiveSelectorIds,
  searchDict: Record<string, string>
): boolean => {
  if (!headingSelectorIds || isEmpty(headingSelectorIds)) return true;
  const headingsMethodParent = headingSelectorIds['method-option'];
  const headingsTabParent = headingSelectorIds['tab'];
  const headingsComposableParent = headingSelectorIds['selected-content'] ?? {};
  const composableHeadingVisible = Object.keys(headingsComposableParent).reduce((res, key) => {
    if (!res) return res;
    return (
      searchDict[key] === headingsComposableParent[key] ||
      (!searchDict[key] && headingsComposableParent[key] === 'None')
    );
  }, true);
  if (
    (headingsMethodParent && headingsMethodParent !== activeSelectorIds.methodSelector) ||
    (headingsTabParent && !activeSelectorIds.tab?.includes(headingsTabParent)) ||
    (headingsComposableParent && !composableHeadingVisible)
  ) {
    return false;
  }
  return isHeadingVisible(headingSelectorIds.children ?? {}, activeSelectorIds, searchDict);
};

const Contents = ({ className, slug }: { className: string; slug: string }) => {
  const { activeHeadingId, headingNodes, showContentsComponent, activeSelectorIds } = useContext(ContentsContext);
  const { isTabletOrMobile } = useScreenSize();
  const metadata = useSnootyMetadata();
  const { search } = useLocation();
  const searchDict = search
    .slice(1)
    .split('&')
    .reduce((res: Record<string, string>, querySelection) => {
      const [key, value] = querySelection.split('=');
      res[key] = value;
      return res;
    }, {});

  const filteredNodes = headingNodes.filter((headingNode) => {
    return isHeadingVisible(headingNode.selector_ids, activeSelectorIds, searchDict);
  });

  if (filteredNodes.length === 0 || !showContentsComponent) {
    return (
      <div className={className}>
        <FeedbackRating slug={slug} className={formStyle} />
      </div>
    );
  }

  const label = 'On this page';

  return (
    <>
      {!isTabletOrMobile && !DEPRECATED_PROJECTS.includes(metadata.project) && (
        <FeedbackRating slug={slug} className={formStyle} classNameContainer={formContainer} />
      )}
      <div className={cx(className, styledContentList)}>
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
      {isTabletOrMobile && !DEPRECATED_PROJECTS.includes(metadata.project) && (
        <FeedbackRating slug={slug} className={formStyle} classNameContainer={formContainer} />
      )}
    </>
  );
};

export default Contents;
