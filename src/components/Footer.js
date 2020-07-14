import React from 'react';
import { FeedbackFooter } from './Widgets/FeedbackWidget';

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
