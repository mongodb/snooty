import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const Meta = ({ nodeData: { options } }) => (
  <Helmet>
    {Object.entries(options).map(([key, value]) => (
      <meta key={key} name={key} content={value} />
    ))}
  </Helmet>
);

Meta.propTypes = {
  nodeData: PropTypes.shape({
    options: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Meta;
