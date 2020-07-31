import React from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';

const FootnoteReference = ({ footnotes, nodeData: { id, refname } }) => {
  // Get the ID of the parent of an anonymous footnote reference
  const getAnonymousFootnote = () => {
    return Object.keys(footnotes).find(key => {
      const referent = getNestedValue([key, 'references'], footnotes) || [];
      return referent.includes(id);
    });
  };
  const ref = refname || getAnonymousFootnote();
  return (
    <a className="footnote-reference" href={`#fn${id}`} id={id}>
      [{getNestedValue([ref, 'label'], footnotes)}]
    </a>
  );
};

FootnoteReference.propTypes = {
  footnotes: PropTypes.objectOf(PropTypes.object).isRequired,
  nodeData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    refname: PropTypes.string,
  }).isRequired,
};

export default FootnoteReference;
