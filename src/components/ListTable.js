import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import CSSWrapper from './CSSWrapper';
import { getNestedValue } from '../utils/get-nested-value';

const ListTable = ({ nodeData, nodeData: { children }, ...rest }) => {
  const headerRowCount = parseInt(getNestedValue(['options', 'header-rows'], nodeData), 10) || 0;
  const stubColumnCount = parseInt(getNestedValue(['options', 'stub-columns'], nodeData), 10) || 0;
  const headerRows = children[0].children[0].children.slice(0, headerRowCount);
  const bodyRows = children[0].children.slice(headerRowCount);
  const customWidth = getNestedValue(['options', 'width'], nodeData) || 'auto';
  const customAlign = getNestedValue(['options', 'align'], nodeData)
    ? `align-${getNestedValue(['options', 'align'], nodeData)}`
    : '';

  let widths = 'colwidths-auto';
  const customWidths = getNestedValue(['options', 'widths'], nodeData);
  if (customWidths && customWidths !== 'auto') {
    widths = 'colwidths-given';
  }

  return (
    <table
      className={['docutils', getNestedValue(['options', 'class'], nodeData) || '', widths, customAlign].join(' ')}
      style={{ width: customWidth }}
    >
      {widths === 'colwidths-given' && <ColGroup widths={customWidths.split(/[ ,]+/)} />}
      <ListTableHeader {...rest} rows={headerRows} stubColumnCount={stubColumnCount} />
      <ListTableBody {...rest} rows={bodyRows} headerRowCount={headerRowCount} stubColumnCount={stubColumnCount} />
    </table>
  );
};

const ColGroup = ({ widths }) => (
  <colgroup>
    {widths.map((width, index) => (
      <col width={`${width}%`} key={index} />
    ))}
  </colgroup>
);

ColGroup.propTypes = {
  widths: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const ListTableHeader = ({ rows, stubColumnCount, ...rest }) => (
  <thead valign="bottom">
    {rows.map((row, index) => (
      <ListTableHeaderRow {...rest} row={row.children} rowIndex={index} stubColumnCount={stubColumnCount} key={index} />
    ))}
  </thead>
);

ListTableHeader.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.object).isRequired,
    })
  ).isRequired,
  stubColumnCount: PropTypes.number.isRequired,
};

const ListTableHeaderRow = ({ row, rowIndex, stubColumnCount, ...rest }) => (
  <tr className={rowIndex % 2 === 0 ? 'row-odd' : 'row-even'}>
    {row.map((column, colIndex) => (
      <th className={`head ${colIndex <= stubColumnCount - 1 && 'stub'}`} key={colIndex}>
        <ComponentFactory {...rest} nodeData={getNestedValue(['children', 0], column)} parentNode="listTable" />
      </th>
    ))}
  </tr>
);

ListTableHeaderRow.propTypes = {
  row: PropTypes.arrayOf(
    PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.object).isRequired,
    })
  ).isRequired,
  rowIndex: PropTypes.number.isRequired,
  stubColumnCount: PropTypes.number.isRequired,
};

const ListTableBody = ({ rows, headerRowCount, stubColumnCount, ...rest }) => (
  <tbody valign="top">
    {rows.map((row, index) => (
      <ListTableBodyRow
        {...rest}
        key={index}
        row={getNestedValue(['children', 0, 'children'], row)}
        rowIndex={index + headerRowCount}
        stubColumnCount={stubColumnCount}
      />
    ))}
  </tbody>
);

ListTableBody.propTypes = {
  headerRowCount: PropTypes.number.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.object).isRequired,
    })
  ).isRequired,
  stubColumnCount: PropTypes.number.isRequired,
};

const ListTableBodyRow = ({ row, rowIndex, stubColumnCount, ...rest }) => (
  <tr className={rowIndex % 2 === 0 ? 'row-odd' : 'row-even'}>
    {row.map((column, colIndex) => (
      <td className={`${colIndex <= stubColumnCount - 1 ? 'stub' : ''}`} key={colIndex}>
        {column.children.map((element, index) => {
          let colClass = [];
          if (index === 0) {
            colClass.push('first');
          }
          if (index === column.children.length - 1) {
            colClass.push('last');
          }
          return (
            <CSSWrapper className={colClass.join(' ')} key={index}>
              <ComponentFactory {...rest} key={index} nodeData={element} parentNode="listTable" />
            </CSSWrapper>
          );
        })}
      </td>
    ))}
  </tr>
);

ListTableBodyRow.propTypes = {
  row: PropTypes.arrayOf(
    PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.object).isRequired,
    })
  ).isRequired,
  rowIndex: PropTypes.number.isRequired,
  stubColumnCount: PropTypes.number.isRequired,
};

ListTable.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
    options: PropTypes.shape({
      align: PropTypes.string,
      class: PropTypes.string,
      'header-rows': PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      'stub-columns': PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.string,
      widths: PropTypes.string,
    }),
  }).isRequired,
};

export default ListTable;
