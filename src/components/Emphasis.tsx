import { getNestedValue } from '../utils/get-nested-value';
import { EmphasisNode } from '../types/ast';

const Emphasis = ({ nodeData }: { nodeData: EmphasisNode }) => (
  <em>{getNestedValue(['children', 0, 'value'], nodeData)}</em>
);

export default Emphasis;
