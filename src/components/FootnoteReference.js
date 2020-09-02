import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';
import FootnoteContext from './footnote-context';

const FootnoteReference = ({ nodeData: { id, refname } }) => {
  const { footnotes } = useContext(FootnoteContext);

  // Get the ID of the parent of an anonymous footnote reference
  const getAnonymousFootnote = () => {
    return Object.keys(footnotes).find(key => {
      const referent = getNestedValue([key, 'references'], footnotes) || [];
      return referent.includes(id);
    });
  };
  const ref = refname || getAnonymousFootnote();
  return (
    <a className="footnote-reference" href={`#${ref}`} id={id}>
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
