import React from 'react';
import ComponentFactory from '../components/ComponentFactory';
import { FormatTextOptions } from '../components/Literal';
import { ASTNode } from '../types/ast';
import { isDirectiveNode } from '../types/ast-utils';

/*
 * Given either a string or an array of Snooty text nodes, return the appropriate text output.
 */
export const formatText = (text?: string | ASTNode[], options?: FormatTextOptions) => {
  if (!text) return '';
  return typeof text === 'string'
    ? text
    : text.map((e, index) => {
        if (isDirectiveNode(e) && e.name === 'icon') {
          return null;
        }
        return <ComponentFactory key={index} nodeData={e} formatTextOptions={options} />;
      });
};
