import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import TOCNode from './TOCNode';
import { TOCContext } from './toc-context';

/**
 * Overall Table of Contents component, which manages open sections as children
 */
const TableOfContents = ({ activeSection, height, toctreeData: { children } }) => (
  <TOCContext.Provider value={{ activeSection }}>
    <ul
      className="current"
      css={css`
        height: calc(100% - ${height}px);
        overflow-y: auto;
        width: 100%;
      `}
    >
      {children.map((c) => {
        const key = c.slug || c.url;
        return <TOCNode node={c} key={key} />;
      })}
    </ul>
  </TOCContext.Provider>
);

TableOfContents.propTypes = {
  activeSection: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  toctreeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default TableOfContents;
