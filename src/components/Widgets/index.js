import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { isBrowser } from '../../utils/is-browser';
import { theme } from '../../theme/docsTheme';
import { FeedbackProvider, FeedbackForm, FeedbackButton, useFeedbackData } from './FeedbackWidget';
import ChatbotFab from './ChatbotWidget/ChatbotFab';

const WidgetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: end;
<<<<<<< HEAD
  gap: ${theme.size.small};
  position: fixed;
  right: ${theme.size.large};
  bottom: ${theme.size.large};
=======
  gap: 8px;
  position: fixed;
  right: 32px;
  bottom: 32px;
>>>>>>> 2439c86 (layout of chatbot fab and feedback fab)

  @media ${theme.screenSize.upToSmall} {
    background-color: white;
    width: 100%;
    height: 60px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.25);
    right: 0;
    bottom: 0;
<<<<<<< HEAD
    min-width: max-content;
=======
>>>>>>> 2439c86 (layout of chatbot fab and feedback fab)

    > button {
      height: 44px;
      position: unset;
    }
  }
`;

const Widgets = ({ children, pageOptions, pageTitle, publishedBranches, slug, isInPresentationMode, template }) => {
  const url = isBrowser ? window.location.href : null;
  const hideFeedbackHeader = pageOptions.hidefeedback === 'header';
  const feedbackData = useFeedbackData({
    slug,
    url,
    title: pageTitle || 'Home',
    publishedBranches,
  });

  // DOP-4025: hide feedback tab on homepage
  const hideFeedback = pageOptions.hidefeedback === 'page';

  return (
    <FeedbackProvider page={feedbackData} hideHeader={hideFeedbackHeader}>
      {children}
      {!isInPresentationMode && !hideFeedback && (
<<<<<<< HEAD
        /* Suspense at this level ensures that widgets will appear simultaneously rather than one-by-one as loaded */
        <Suspense fallback={null}>
          <WidgetsContainer className={widgetsContainer}>
            <FeedbackButton />
            <FeedbackForm />
            {template !== 'landing' && <ChatbotFab />}
          </WidgetsContainer>
        </Suspense>
=======
        <WidgetsContainer>
          <FeedbackButton />
          <FeedbackForm />
          {template !== 'landing' && <ChatbotFab />}
        </WidgetsContainer>
>>>>>>> 2439c86 (layout of chatbot fab and feedback fab)
      )}
    </FeedbackProvider>
  );
};

Widgets.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  pageOptions: PropTypes.shape({
    hideFeedback: PropTypes.string,
  }),
  pageTitle: PropTypes.string.isRequired,
  publishedBranches: PropTypes.object,
  slug: PropTypes.string.isRequired,
  isInPresentationMode: PropTypes.bool,
};

Widgets.defaultProps = {
  pageOptions: {},
};

export const widgetsContainer = 'widgets';
export default Widgets;
