import React from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
const FeedbackFooter = loadable(() => import('./Widgets/FeedbackWidget/FeedbackFooter'));

const Footer = ({ disableFeedback }) => (
  <>
    {!disableFeedback && <FeedbackFooter />}
    {!process.env.GATSBY_FEATURE_FLAG_CONSISTENT_NAVIGATION && (
      <div className="footer">
        <div className="copyright">
          <p>
            © MongoDB, Inc 2008-present. MongoDB, Mongo, and the leaf logo are registered trademarks of MongoDB, Inc.
          </p>
        </div>
      </div>
    )}
  </>
);

Footer.propTypes = {
  disableFeedback: PropTypes.bool,
};

export default Footer;
