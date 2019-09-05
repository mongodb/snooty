import React from 'react';
import PropTypes from 'prop-types';

const FootnoteReference = ({ nodeData: { label, id, refname } }) => (
  <a className="footnote-reference" href={`#${refname}`} id={id}>
    [{label}]
  </a>
);

FootnoteReference.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    refname: PropTypes.string.isRequired,
  }).isRequired,
};

export default FootnoteReference;
