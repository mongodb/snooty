import React from 'react';
import PropTypes from 'prop-types';
import TOCNode from './TOCNode';

/**
 * Overall Table of Contents component, which manages open sections as children
 */
const TableOfContents = ({ toctreeData: { children } }) => {
  return (
    <ul className="current">
      {children.map(c => {
        const key = c.slug || c.url;
        return <TOCNode node={c} key={key} />;
      })}
    </ul>
  );
};

TableOfContents.propTypes = {
  toctreeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default TableOfContents;
