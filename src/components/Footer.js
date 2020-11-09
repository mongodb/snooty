import React from 'react';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
const FeedbackFooter = loadable(() => import('./Widgets/FeedbackWidget/FeedbackFooter'));

const Footer = props => {
  const { enableFeedback } = props;

  return (
    <>
      {enableFeedback && <FeedbackFooter />}
      <div className="footer">
        <div className="copyright">
          <p>
            © MongoDB, Inc 2008-present. MongoDB, Mongo, and the leaf logo are registered trademarks of MongoDB, Inc.
          </p>
        </div>
      </div>
    </>
  );
};

Footer.propTypes = {
  enableFeedback: PropTypes.bool,
};

Footer.defaultProps = {
  enableFeedback: true,
};

export default Footer;
