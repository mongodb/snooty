import React from 'react';
import PropTypes from 'prop-types';

const Meta = ({ options }) => {
  return (
    <>
      {Object.entries(options).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}
    </>
  );
};

Meta.propTypes = {
  options: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Meta;
