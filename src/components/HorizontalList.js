import React from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';
import ComponentFactory from './ComponentFactory';

const HorizontalList = ({
  nodeData,
  nodeData: {
    options: { columns },
  },
  ...rest
}) => {
  // Divide an array into an array of n arrays as evenly as possible
  const chunkArray = (arr, n) => {
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

HorizontalList.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({
      columns: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default HorizontalList;
