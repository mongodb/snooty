import React from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
const FeedbackFooter = loadable(() => import('./Widgets/FeedbackWidget/FeedbackFooter'));

const Footer = ({ disableFeedback }) => <>{!disableFeedback && <FeedbackFooter />}</>;

Footer.propTypes = {
  disableFeedback: PropTypes.bool,
};

export default Footer;
