import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';
import FootnoteContext from './footnote-context';

const FootnoteReference = ({ nodeData: { id, refname } }) => {
  const { footnotes } = useContext(FootnoteContext);

  // the nodeData originates from docutils, and may be incorrect for
  // footnoteReferences originating from included files

  if (!refname) {
    id = 'anon-' + id;
  }

  // Get the ID of the parent of an anonymous footnote reference
  const getAnonymousFootnote = () => {
    return Object.keys(footnotes).find(key => {
      const referent = getNestedValue([key, 'references'], footnotes) || [];
      return referent.includes(id);
    });
  };
  let anonFootnote = getAnonymousFootnote();
  let ref = refname || anonFootnote;
  if (!refname) {
    ref = id.replace('anon-id', '');
  }
  return (
    <a className="footnote-reference" href={`#footnote-${id}`} id={`footnote-ref-${id}`}>
      [{getNestedValue([ref, 'label'], footnotes) || ref}]
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
