import React from 'react';
import type { StrongNode } from '../types/ast';

interface StrongProps {
  nodeData: StrongNode;
}

const Strong = ({ nodeData }: StrongProps) => {
  return <strong>{nodeData?.children?.[0]?.value}</strong>;
};

export default Strong;
