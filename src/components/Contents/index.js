import React, { useContext } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { cx, css } from '@leafygreen-ui/emotion';
import { formatText } from '../../utils/format-text';
import FeedbackRating from '../Widgets/FeedbackWidget';
import useScreenSize from '../../hooks/useScreenSize';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { theme } from '../../theme/docsTheme';
import ContentsListItem from './ContentsListItem';
import ContentsList from './ContentsList';
import { ContentsContext } from './contents-context';

const formatTextOptions = {
  literalEnableInline: true,
};

const formstyle = css`
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

const formContainer = css`
  @media ${theme.screenSize.tablet} {
    z-index: 1;
  }
`;

const isHeadingVisible = (headingSelectorIds, activeSelectorIds) => {
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

export const DEPRECATED_PROJECTS = ['atlas-app-services', 'datalake', 'realm'];

const styledContentList = css`
  overflow: auto;
  height: 90%;
`;

const Contents = ({ className, slug }) => {
  const { isTabletOrMobile } = useScreenSize();
  const { activeHeadingId, headingNodes, showContentsComponent, activeSelectorIds } = useContext(ContentsContext);
  const filteredNodes = headingNodes.filter((headingNode) => {
    return isHeadingVisible(headingNode.selector_ids, activeSelectorIds);
  });
  const metadata = useSnootyMetadata();

  if (filteredNodes.length === 0 || !showContentsComponent) {
    return (
      <div className={className}>
        <FeedbackRating slug={slug} className={formstyle} />
      </div>
    );
  }

  const label = 'On this page';

  return (
    <>
      {!isTabletOrMobile && !DEPRECATED_PROJECTS.includes(metadata.project) && (
        <FeedbackRating slug={slug} className={formstyle} classNameContainer={formContainer} />
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
        <FeedbackRating slug={slug} className={formstyle} classNameContainer={formContainer} />
      )}
    </>
  );
};

Contents.propTypes = {
  className: PropTypes.string,
};

export default Contents;
