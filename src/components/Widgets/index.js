import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { isBrowser } from '../../utils/is-browser';
import { theme } from '../../theme/docsTheme';
import { InstruqtContext } from '../Instruqt/instruqt-context';
import { SuspenseHelper } from '../SuspenseHelper';
import { FeedbackProvider, FeedbackForm, FeedbackButton, useFeedbackData } from './FeedbackWidget';
import ChatbotFab from './ChatbotWidget/ChatbotFab';

const WidgetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: end;
  gap: ${theme.size.small};
  position: fixed;
  right: ${theme.size.large};
  bottom: ${({ hasOpenLabDrawer }) => (hasOpenLabDrawer ? '70px' : theme.size.large)};

  @media ${theme.screenSize.upToSmall} {
    background-color: white;
    width: 100%;
    height: ${theme.widgets.buttonContainerMobileHeight};
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.25);
    right: 0;
    bottom: 0;
    min-width: max-content;

    > button {
      height: 44px;
      position: unset;
    }
  }
`;

const Widgets = ({ children, pageOptions, pageTitle, slug, isInPresentationMode, template }) => {
  const { isOpen } = useContext(InstruqtContext);
  const url = isBrowser ? window.location.href : null;
  const hideFeedbackHeader = pageOptions.hidefeedback === 'header';
  const feedbackData = useFeedbackData({
    slug,
    url,
    title: pageTitle || 'Home',
  });

  // DOP-4025: hide feedback tab on homepage
  const hideFeedback = pageOptions.hidefeedback === 'page';

  return (
    <FeedbackProvider page={feedbackData} hideHeader={hideFeedbackHeader}>
      {children}
      {!isInPresentationMode && !hideFeedback && (
        /* Suspense at this level ensures that widgets will appear simultaneously rather than one-by-one as loaded */
        <SuspenseHelper fallback={null}>
          <WidgetsContainer className={widgetsContainer} hasOpenLabDrawer={isOpen}>
            <FeedbackButton />
            <FeedbackForm />
            {template !== 'landing' && <ChatbotFab />}
          </WidgetsContainer>
        </SuspenseHelper>
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
  slug: PropTypes.string.isRequired,
  isInPresentationMode: PropTypes.bool,
};

Widgets.defaultProps = {
  pageOptions: {},
};

export const widgetsContainer = 'widgets';
export default Widgets;
