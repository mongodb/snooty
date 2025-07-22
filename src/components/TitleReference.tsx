import React from 'react';
import { TitleReferenceNode } from '../types/ast';

const TitleReference = ({
  nodeData: {
    children: [{ value }],
  },
}: {
  nodeData: TitleReferenceNode;
}) => <cite>{value}</cite>;

export default TitleReference;
