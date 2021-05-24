import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';
import FootnoteContext from './footnote-context';
import StyledLink from './StyledLink';

const FootnoteReference = ({ nodeData: { id, refname } }) => {
  const { footnotes } = useContext(FootnoteContext);

  // the nodeData originates from docutils, and may be incorrect for
  // anonymous footnoteReferences originating from included files -- docutils
  // appears to assign IDs within the included files before they are collated

  const ref = refname || id.replace('id', '');
  const uid = refname ? `${refname}-${id}` : id;
  return (
    <StyledLink to={`#footnote-${ref}`} id={`ref-${uid}`}>
      [{getNestedValue([ref, 'label'], footnotes) || ref}]
    </StyledLink>
  );
};

FootnoteReference.propTypes = {
  nodeData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    refname: PropTypes.string,
  }).isRequired,
};

export default FootnoteReference;
