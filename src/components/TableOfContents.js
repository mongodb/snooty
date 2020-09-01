import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TOCNode from './TOCNode';
import { TOCContext } from './toc-context';
import { isBrowser } from '../utils/is-browser';

/**
 * Overall Table of Contents component, which manages open sections as children
 */
const TableOfContents = ({ toctreeData: { children } }) => {
  // Want to check this on each re-render
  let currentPage;
  if (isBrowser) {
    currentPage = window.location.pathname;
  }

  const [activeSection, setActiveSection] = useState(currentPage);
  useEffect(() => {
    setActiveSection(currentPage);
  }, [currentPage]);

  return (
    <TOCContext.Provider value={{ activeSection, setActiveSection }}>
      <ul className="current">
        {children.map(c => {
          const key = c.slug || c.url;
          return <TOCNode node={c} key={key} />;
        })}
      </ul>
    </TOCContext.Provider>
  );
};

TableOfContents.propTypes = {
  toctreeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default TableOfContents;
