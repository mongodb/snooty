import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';
import FootnoteContext from './footnote-context';

const FootnoteReference = ({ nodeData: { id, refname } }) => {
  const { footnotes } = useContext(FootnoteContext);

  // the nodeData originates from docutils, and may be incorrect for
  // footnoteReferences inside included files
  if (!refname) {
    footnotes.__anonymous_count = footnotes.__anonymous_count || 0;
    id = 'id' + (footnotes.__anonymous_count + 1);
    footnotes.__anonymous_count += 1;
  }

  // Get the ID of the parent of an anonymous footnote reference
  const getAnonymousFootnote = () => {
    return Object.keys(footnotes).find(key => {
      const referent = getNestedValue([key, 'references'], footnotes) || [];
      return referent.includes(id);
    });
  };
  const ref = refname || getAnonymousFootnote();
  return (
    <a className="footnote-reference" href={`#footnote-${id}`} id={`footnote-ref-${id}`}>
      [{getNestedValue([ref, 'label'], footnotes)}]
    </a>
  );
};

FootnoteReference.propTypes = {
  nodeData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    refname: PropTypes.string,
  }).isRequired,
};

export default FootnoteReference;
