import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const VersionModified = ({ introText, nodeData, ...rest }) => {
  const version = getNestedValue(['argument', 0, 'value'], nodeData);
  return (
    <div className={nodeData.name}>
      <p>
        <span className="versionmodified">
          {introText} {version}
          {nodeData.children.length > 0 || nodeData.argument.length > 1 ? ': ' : '.'}
        </span>
        {nodeData.argument.length > 1 &&
          nodeData.argument.slice(1).map((child, index) => <ComponentFactory {...rest} nodeData={child} key={index} />)}
      </p>
      {nodeData.children.map((child, index) => (
        <ComponentFactory {...rest} nodeData={child} key={index} />
      ))}
    </div>
  );
};

VersionModified.propTypes = {
  introText: PropTypes.string.isRequired,
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ).isRequired,
    children: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default VersionModified;
