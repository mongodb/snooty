import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const DocumentBody = ({ pageContext: { metadata, page, slug } }) => {
  const pageNodes = getNestedValue(['ast', 'children'], page) || [];
  return (
    <React.Fragment>
      {pageNodes.map((child, index) => (
        <ComponentFactory key={index} metadata={metadata} nodeData={child} page={page} slug={slug} />
      ))}
    </React.Fragment>
  );
};

DocumentBody.propTypes = {
  pageContext: PropTypes.shape({
    metadata: PropTypes.object.isRequired,
    page: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.array,
      }).isRequired,
    }).isRequired,
    slug: PropTypes.string.isRequired,
  }),
};

export default DocumentBody;
