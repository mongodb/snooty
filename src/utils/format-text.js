import React from 'react';
import ComponentFactory from '../components/ComponentFactory';

/*
 * Given either a string or an array of Snooty text nodes, return the appropriate text output.
 */
export const formatText = (text) => {
  if (!text) return '';
  return typeof text === 'string' ? text : text.map((e, index) => <ComponentFactory key={index} nodeData={e} />);
};
