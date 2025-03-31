import React, { useContext } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { formatText } from '../../utils/format-text';
import { isBrowser } from '../../utils/is-browser';
import { getPlaintext } from '../../utils/get-plaintext';
import { getNestedValue } from '../../utils/get-nested-value';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { FeedbackProvider, FeedbackForm, useFeedbackData, FeedbackContainer } from '../Widgets/FeedbackWidget';
import { RatingView } from '../Widgets/FeedbackWidget/views';
import ContentsListItem from './ContentsListItem';
import ContentsList from './ContentsList';
import { ContentsContext } from './contents-context';

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

const Contents = ({ className, slug }) => {
  const { activeHeadingId, headingNodes, showContentsComponent, activeSelectorIds } = useContext(ContentsContext);
  const url = isBrowser ? window.location.href : null;
  const metadata = useSnootyMetadata();
  const feedbackData = useFeedbackData({
    slug,
    url,
    title:
      getPlaintext(getNestedValue(['slugToTitle', slug === '/' ? 'index' : slug], metadata)) || 'MongoDB Documentation',
  });

  const filteredNodes = headingNodes.filter((headingNode) => {
    return isHeadingVisible(headingNode.selector_ids, activeSelectorIds);
  });

  if (filteredNodes.length === 0 || !showContentsComponent) {
    return null;
  }

  const label = 'On this page';

  return (
    <div className={className}>
      {/* move feedback widget here */}
      {console.log('whats up dog?')}
      <FeedbackProvider page={feedbackData}>
        <FeedbackContainer>
          <FeedbackForm />
          <RatingView />
        </FeedbackContainer>
      </FeedbackProvider>

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
