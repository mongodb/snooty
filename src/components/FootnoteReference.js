import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';
import FootnoteContext from './footnote-context';

const FootnoteReference = ({ nodeData: { id, refname } }) => {
  const { footnotes } = useContext(FootnoteContext);

  // the nodeData originates from docutils, and may be incorrect for
  // anonymous footnoteReferences originating from included files

  const ref = refname || id.replace('id', '');
  return (
    <a className="footnote-reference" href={`#${ref}`} id={`ref-${id}`}>
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
