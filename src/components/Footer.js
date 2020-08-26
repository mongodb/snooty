import React from 'react';
import loadable from '@loadable/component';
const FeedbackFooter = loadable(() => import('./Widgets/FeedbackWidget/FeedbackFooter'));

const Footer = () => (
  <>
    <FeedbackFooter />
    <div className="footer">
      <div className="copyright">
        <p>© MongoDB, Inc 2008-present. MongoDB, Mongo, and the leaf logo are registered trademarks of MongoDB, Inc.</p>
      </div>
    </div>
  </>
);

export default Footer;
