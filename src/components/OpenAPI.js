import React from 'react';
import PropTypes from 'prop-types';
import { RedocStandalone } from 'redoc';
import ComponentFactory from './ComponentFactory';

const OpenAPI = ({ nodeData: { argument, children, options = {} }, ...rest }) => {
  const isUrl = options?.isUrl;
  const snootyParse = options?.['snooty-parse'];

  if (snootyParse) {
    return (
      <>
        {children.map((node, i) => (
          <ComponentFactory {...rest} key={i} nodeData={node} />
        ))}
      </>
    );
  }

  const source = isUrl ? argument[0] : children[0];
  if (!source) {
    return null;
  }
  const specOrUrl = isUrl ? source.refuri : JSON.parse(source.value);

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
      isUrl: PropTypes.bool,
      snooty_parse: PropTypes.bool,
    }).isRequired,
  }).isRequired,
};

export default OpenAPI;
