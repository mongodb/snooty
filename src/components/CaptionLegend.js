import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const CaptionLegend = ({ nodeData: { children }, ...rest }) => (
  <React.Fragment>
    {children.length > 0 && (
      <p className="caption">
        <span className="caption-text">
          <ComponentFactory {...rest} nodeData={children[0]} parentNode="caption" />
        </span>
      </p>
    )}
    {children.length > 1 && (
      <div className="legend">
        {children.slice(1).map((child, index) => (
          <ComponentFactory {...rest} key={index} nodeData={child} />
        ))}
      </div>
    )}
  </React.Fragment>
);

CaptionLegend.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default CaptionLegend;
