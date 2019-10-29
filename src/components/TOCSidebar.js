import React, { useContext } from 'react';
import TableOfContents from './TableOfContents';
import { TOCContext } from './toc-context';

const TOCSidebar = props => {
  const { toggleSidebar } = useContext(TOCContext);
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sphinxsidebar" id="sphinxsidebar">
        <div id="sphinxsidebarwrapper" className="sphinxsidebarwrapper">
          <a // eslint-disable-line jsx-a11y/anchor-is-valid, jsx-a11y/interactive-supports-focus, no-script-url
            className="closeNav"
            id="closeNav"
            onClick={toggleSidebar}
            role="button"
          >
            Close ×
          </a>
          <TableOfContents {...props} />
        </div>
      </div>
    </aside>
  );
};

export default TOCSidebar;
