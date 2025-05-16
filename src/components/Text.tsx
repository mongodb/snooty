import React from 'react';
import { TextNode } from '../types/ast';

const Text = ({ nodeData: { value } }: { nodeData: TextNode }) => <React.Fragment>{value}</React.Fragment>;

export default Text;
