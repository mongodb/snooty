import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const DocumentBody = ({ addPillstrip, footnotes, pillstrips, refDocMapping, slug, slugTitleMapping }) => {
  const pageNodes = getNestedValue(['ast', 'children'], refDocMapping) || [];
  return (
    <React.Fragment>
      {pageNodes.map((child, index) => (
        <ComponentFactory
          addPillstrip={addPillstrip}
          footnotes={footnotes}
          key={index}
          nodeData={child}
          refDocMapping={refDocMapping}
          pillstrips={pillstrips}
          slug={slug}
          slugTitleMapping={slugTitleMapping}
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
  slugTitleMapping: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.string])),
};

DocumentBody.defaultProps = {
  addPillstrip: () => {},
  footnotes: {},
  pillstrips: {},
  slugTitleMapping: {},
};

export default DocumentBody;
