import React from 'react';
import PropTypes from 'prop-types';
import { FeedbackProvider, FeedbackForm, FeedbackTab, useFeedbackData } from './FeedbackWidget';
import { isBrowser } from '../../utils/is-browser';

const Widgets = ({ children, location, pageTitle, publishedBranches, slug }) => {
  const url = isBrowser ? window.location.href : null;
  const feedbackData = useFeedbackData({
    slug,
    url,
    title: pageTitle || 'Home',
    publishedBranches,
  });

  return (
    <FeedbackProvider page={feedbackData}>
      {children}
      <FeedbackTab />
      <FeedbackForm />
    </FeedbackProvider>
  );
};

Widgets.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  location: PropTypes.shape({
    href: PropTypes.string.isRequired,
  }).isRequired,
  pageTitle: PropTypes.string.isRequired,
  publishedBranches: PropTypes.object.isRequired,
  slug: PropTypes.string.isRequired,
};

export default Widgets;
