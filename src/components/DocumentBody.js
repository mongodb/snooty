import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const DocumentBody = ({ addPillstrip, footnotes, metadata, pillstrips, refDocMapping, slug }) => {
  const pageNodes = getNestedValue(['ast', 'children'], refDocMapping) || [];
  return (
    <React.Fragment>
      {pageNodes.map((child, index) => (
        <ComponentFactory
          addPillstrip={addPillstrip}
          footnotes={footnotes}
          key={index}
          metadata={metadata}
          nodeData={child}
          refDocMapping={refDocMapping}
          pillstrips={pillstrips}
          slug={slug}
        />
      ))}
    </React.Fragment>
  );
};

DocumentBody.propTypes = {
  addPillstrip: PropTypes.func,
  footnotes: PropTypes.objectOf(PropTypes.object),
  pillstrips: PropTypes.objectOf(PropTypes.object),
  refDocMapping: PropTypes.shape({
    ast: PropTypes.shape({
      children: PropTypes.array,
    }).isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

DocumentBody.defaultProps = {
  addPillstrip: () => {},
  footnotes: {},
  pillstrips: {},
};

export default DocumentBody;
