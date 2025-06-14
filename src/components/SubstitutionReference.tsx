import React from 'react';
import type { SubstitutionReferenceNode } from '../types/ast';
import ComponentFactory from './ComponentFactory';

interface SubstitutionReferenceProps {
  nodeData: SubstitutionReferenceNode;
}

const SubstitutionReference = ({ nodeData: { children, name }, ...rest }: SubstitutionReferenceProps) => (
  <React.Fragment>
    {children ? children.map((child, index) => <ComponentFactory {...rest} nodeData={child} key={index} />) : name}
  </React.Fragment>
);

export default SubstitutionReference;
