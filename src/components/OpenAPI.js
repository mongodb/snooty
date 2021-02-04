import React from 'react';
import PropTypes from 'prop-types';
import { RedocStandalone } from 'redoc';
import ComponentFactory from './ComponentFactory';

const OpenAPI = ({ nodeData: { argument, children, options = {} }, ...rest }) => {
  const parse_method = options?.['parse-method'];
  if (parse_method === 'snooty') {
    return (
      <>
        {children.map((node, i) => (
          <ComponentFactory {...rest} key={i} nodeData={node} />
        ))}
      </>
    );
  }

  const isParseUrl = parse_method === 'url';
  const source = isParseUrl ? argument[0] : children[0];
  if (!source) {
    return null;
  }
  const specOrUrl = isParseUrl ? source.refuri : JSON.parse(source.value);

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
      parse_method: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default OpenAPI;
