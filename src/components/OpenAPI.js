import React from 'react';
import PropTypes from 'prop-types';
import { RedocStandalone } from 'redoc';
import ComponentFactory from './ComponentFactory';

const OpenAPI = ({ nodeData: { argument, children, options = {} }, ...rest }) => {
  const usesRST = options?.['uses-rst'];

  if (usesRST) {
    return (
      <>
        {children.map((node, i) => (
          <ComponentFactory {...rest} key={i} nodeData={node} />
        ))}
      </>
    );
  }

  // Check for JSON string spec first
  const spec = children[0]?.value;
  const specOrUrl = spec ? JSON.parse(spec) : argument[0]?.refuri;
  if (!specOrUrl) {
    return null;
  }

  return (
    <RedocStandalone
      options={{
        maxDisplayedEnumValues: 5,
      }}
      spec={specOrUrl}
      specUrl={specOrUrl}
    />
  );
};

OpenAPI.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({
      uses_rst: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};

export default OpenAPI;
