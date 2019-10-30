import React from 'react';
import TableOfContents from './TableOfContents';

const TOCSidebar = props => (
  <aside className="sidebar" id="sidebar">
    <div className="sphinxsidebar" id="sphinxsidebar">
      <div id="sphinxsidebarwrapper" className="sphinxsidebarwrapper">
        <TableOfContents {...props} />
      </div>
    </div>
  </aside>
);

export default TOCSidebar;
