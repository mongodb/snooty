import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const DocumentBody = ({ addPillstrip, footnotes, pillstrips, refDocMapping, slugTitleMapping, substitutions }) => {
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
          slugTitleMapping={slugTitleMapping}
          substitutions={substitutions}
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
  slugTitleMapping: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.string])),
  substitutions: PropTypes.objectOf(PropTypes.array),
};

DocumentBody.defaultProps = {
  addPillstrip: () => {},
  footnotes: {},
  pillstrips: {},
  slugTitleMapping: {},
  substitutions: {},
};

export default DocumentBody;
