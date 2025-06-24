import React from 'react';
import { getNestedValue } from '../utils/get-nested-value';
import { HorizontalListNode, Node } from '../types/ast';
import ComponentFactory from './ComponentFactory';

export type HorizontalListProps = {
  nodeData: HorizontalListNode;
};

const HorizontalList = ({
  nodeData,
  nodeData: {
    options: { columns },
  },
  ...rest
}: HorizontalListProps) => {
  // Divide an array into an array of n arrays as evenly as possible
  const chunkArray = (arr: Node[], n: number) => {
    if (n < 2) return [arr];

    const len = arr.length;
    const out = [];
    let i = 0;
    let size;

    if (len % n === 0) {
      size = Math.floor(len / n);
      while (i < len) {
        out.push(arr.slice(i, (i += size)));
      }
    } else {
      while (i < len) {
        size = Math.ceil((len - i) / n--); // eslint-disable-line no-plusplus,no-param-reassign
        out.push(arr.slice(i, (i += size)));
      }
    }

    return out;
  };

  const columnArray = chunkArray(getNestedValue(['children', 0, 'children'], nodeData), columns);
  const ListTag = getNestedValue(['children', 0, 'ordered'], nodeData) ? 'ol' : 'ul';
  return (
    <table className="hlist">
      <tbody>
        <tr>
          {columnArray.map((col, colIndex) => (
            <td key={colIndex}>
              <ListTag className="simple">
                {col.map((child, index) => (
                  <ComponentFactory {...rest} key={index} nodeData={child} />
                ))}
              </ListTag>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default HorizontalList;
