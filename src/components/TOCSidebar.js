import React, { useContext } from 'react';
import TableOfContents from './TableOfContents';
import { TOCContext } from './toc-context';

const TOCSidebar = props => {
  const { toggleSidebar } = useContext(TOCContext);
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sphinxsidebar" id="sphinxsidebar">
        <div id="sphinxsidebarwrapper" className="sphinxsidebarwrapper">
          <a href="javascript:void(0)" className="closeNav" id="closeNav" onClick={toggleSidebar}>
            Close ×
          </a>
          <TableOfContents {...props} />
        </div>
      </div>
    </aside>
  );
};

export default TOCSidebar;
