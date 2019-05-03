import React from 'react';
import PropTypes from 'prop-types';

const RoleJavaSyncApi = ({
  nodeData: {
    label: { value },
    name,
    target,
  },
}) => {
  let href;
  if (name === 'java-sync-api') {
    href = `http://mongodb.github.io/mongo-java-driver/3.7/javadoc/${target}`;
  } else if (name === 'csharp-api') {
    href = `https://mongodb.github.io/mongo-csharp-driver/2.5/apidocs/html/${target}.htm`;
  }

  return (
    <a href={href} className="reference external">
      {value}
    </a>
  );
};

RoleJavaSyncApi.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.shape({
      value: PropTypes.string.isRequired,
    }).isRequired,
    name: PropTypes.oneOf(['java-sync-api', 'csharp-api']).isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleJavaSyncApi;
