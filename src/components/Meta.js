import React from 'react';
import PropTypes from 'prop-types';

const Meta = ({ options }) => {
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
  options: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Meta;
