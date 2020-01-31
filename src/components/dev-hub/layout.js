import React from 'react';
import { Link } from 'gatsby';

export default ({ children }) => (
  <div>
    <nav>
      <Link to="/dev-hub">Developers</Link>
      <Link to="/dev-hub/learn">Learn</Link>
      <Link to="/dev-hub/community">Community</Link>
    </nav>
    {children}
    <footer>
      <ul>
        <li>footer item</li>
      </ul>
    </footer>
  </div>
);
