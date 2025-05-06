import React from 'react';
import PropTypes from 'prop-types';
import TOCNode from './TOCNode';

const Toctree = ({ handleClick, slug, toctree: { children } }) => {
  return (
    <>
      {children.map((c, idx) => (
        <TOCNode key={idx} activeSection={slug} handleClick={handleClick} node={c} />
      ))}
    </>
  );
};

Toctree.propTypes = {
  toctree: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string]).isRequired,
        slug: PropTypes.string,
        url: PropTypes.string,
        children: PropTypes.array.isRequired,
        options: PropTypes.shape({
          drawer: PropTypes.bool,
          styles: PropTypes.objectOf(PropTypes.string),
        }),
      })
    ),
  }),
};

export default Toctree;
