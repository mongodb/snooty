import React from 'react';
import PropTypes from 'prop-types';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const OpenAPI = ({ nodeData: { children, options = {} }, ...rest }) => {
  const swagger_parse = getNestedValue(['swagger-parse'], options);
  if (swagger_parse) {
    if (children.length !== 1) {
      return null;
    }
    const spec = JSON.parse(children[0].value);
    return <SwaggerUI spec={spec} />;
  }

  return (
    <>
      {children.map((node, i) => (
        <ComponentFactory {...rest} key={i} nodeData={node} />
      ))}
    </>
  );
};

OpenAPI.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({
      swagger_parse: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};

export default OpenAPI;
