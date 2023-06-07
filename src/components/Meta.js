import React from 'react';
import PropTypes from 'prop-types';

const Meta = ({ nodeDate: { options } }) => {
  return (
    <>
      {options &&
        Object.entries(options).map(([key, value]) => (
          <meta data-testid="directive-meta" key={key} name={key} content={value} />
        ))}
    </>
  );
};

Meta.propTypes = {
  nodeDate: PropTypes.shape({
    options: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Meta;
