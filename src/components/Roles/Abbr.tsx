import React from 'react';
import PropTypes from 'prop-types';
import InlineDefinition from '@leafygreen-ui/inline-definition';
import { theme } from '../../theme/docsTheme';

const Abbr = ({
  nodeData: {
    children: [{ value }],
  },
}) => {
  if (!value) {
    return null;
  }

  // Abbreviations are written as as "ABBR (Full Name Here)", so separate this into `abbr` and `expansion`
  let [abbr, expansion] = value.split('(');
  if (expansion) {
    expansion = expansion.split(')')[0];
    abbr = abbr.trim();
  }
  return (
    <InlineDefinition popoverZIndex={theme.zIndexes.popovers} definition={expansion}>
      {abbr}
    </InlineDefinition>
  );
};

Abbr.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Abbr;
