import React from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';

const FootnoteReference = ({ footnotes, nodeData: { id, refname } }) => (
  <a className="footnote-reference" href={`#${refname}`} id={id}>
    [{getNestedValue([refname, 'label'], footnotes)}]
  </a>
);

FootnoteReference.propTypes = {
  footnotes: PropTypes.objectOf(PropTypes.object).isRequired,
  nodeData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    refname: PropTypes.string.isRequired,
  }).isRequired,
};

export default FootnoteReference;
