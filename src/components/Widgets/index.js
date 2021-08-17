import React from 'react';
import PropTypes from 'prop-types';
import { FeedbackProvider, FeedbackForm, FeedbackTab, useFeedbackData } from './FeedbackWidget';
import { isBrowser } from '../../utils/is-browser';

const Widgets = ({ children, pageOptions, pageTitle, publishedBranches, slug }) => {
  const url = isBrowser ? window.location.href : null;
  const hideFeedbackHeader = pageOptions.hidefeedback === 'header';
  const feedbackData = useFeedbackData({
    slug,
    url,
    title: pageTitle || 'Home',
    publishedBranches,
  });

  return (
    <FeedbackProvider page={feedbackData} hideHeader={hideFeedbackHeader}>
      {children}
      <FeedbackTab />
      <FeedbackForm />
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
};

Widgets.defaultProps = {
  pageOptions: {},
};

export default Widgets;
