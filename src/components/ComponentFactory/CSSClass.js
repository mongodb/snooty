import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './index';
import CSSWrapper from '../CSSWrapper';
import { getNestedValue } from '../../utils/get-nested-value';

const CSSClass = ({ nodeData, ...rest }) => {
  const className = getNestedValue(['argument', 0, 'value'], nodeData);
  return (
    <CSSWrapper className={className}>
      {nodeData.children.map((child, index) => (
        <ComponentFactory {...rest} key={index} nodeData={child} />
      ))}
    </CSSWrapper>
  );
};

CSSClass.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ).isRequired,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        children: PropTypes.array,
      })
    ),
  }).isRequired,
};

export default CSSClass;
