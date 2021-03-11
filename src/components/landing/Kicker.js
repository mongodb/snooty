import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';
import { Overline } from '@leafygreen-ui/typography';

const Kicker = ({ nodeData: { argument }, ...rest }) => (
  <Overline className="kicker">
    {argument.map((child, i) => (
      <ComponentFactory {...rest} nodeData={child} key={i} />
    ))}
  </Overline>
);

Kicker.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Kicker;
