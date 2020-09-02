import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const DocumentBody = ({ addPillstrip, pillstrips, pageContext: { metadata, page, slug } }) => {
  const pageNodes = getNestedValue(['ast', 'children'], page) || [];
  return (
    <React.Fragment>
      {pageNodes.map((child, index) => (
        <ComponentFactory
          addPillstrip={addPillstrip}
          key={index}
          metadata={metadata}
          nodeData={child}
          page={page}
          pillstrips={pillstrips}
          slug={slug}
        />
      ))}
    </React.Fragment>
  );
};

DocumentBody.propTypes = {
  addPillstrip: PropTypes.func,
  pillstrips: PropTypes.objectOf(PropTypes.object),
  page: PropTypes.shape({
    ast: PropTypes.shape({
      children: PropTypes.array,
    }).isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

DocumentBody.defaultProps = {
  addPillstrip: () => {},
  pillstrips: {},
};

export default DocumentBody;
