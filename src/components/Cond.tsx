import React from 'react';
import { getNestedValue } from '../utils/get-nested-value';
import { Directive } from '../types/ast';
import ComponentFactory from './ComponentFactory';

// For now, explicitly define the arguments that should be accepted for Gatsby to build the node
const VALID_COND_ARGS = ['html', '(not man)', 'cloud'];

const Cond = ({ nodeData, ...rest }: { nodeData: Directive }) => {
  const argument = getNestedValue(['argument', 0, 'value'], nodeData);
  if (VALID_COND_ARGS.includes(argument)) {
    return nodeData.children.map((child, index) => <ComponentFactory {...rest} nodeData={child} key={index} />);
  }
  return null;
};

export default Cond;
