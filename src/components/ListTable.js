import React from 'react';
import PropTypes from 'prop-types';

const ListTable = ({ nodeData: { children, options } }) => {
  const headerRowCount = parseInt(options['header-rows'], 10) || 0;
  const stubColumnCount = parseInt(options['stub-columns'], 10) || 0;
  const headerRows = children[0].children[0].children.slice(0, headerRowCount);
  const bodyRows = children[0].children.slice(headerRowCount);
  const customWidth = options.width ? options.width : 'auto';
  const customAlign = options.align ? `align-${options.align}` : '';

  let widths = 'colwidths-auto';
  if (options.widths && options.widths !== 'auto') {
    widths = 'colwidths-given';
  }

  return (
    <table className={['docutils', options.class, widths, customAlign].join(' ')} style={{ width: customWidth }}>
      {widths === 'colwidths-given' && <ColGroup widths={options.widths.split(/[ ,]+/)} />}
      <ListTableHeader rows={headerRows} stubColumnCount={stubColumnCount} />
      <ListTableBody rows={bodyRows} headerRowCount={headerRowCount} stubColumnCount={stubColumnCount} />
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

const ListTableHeader = ({ rows, stubColumnCount }) => (
  <thead valign="bottom">
    {rows.map((row, index) => (
      <ListTableHeaderRow row={row.children} rowIndex={index} stubColumnCount={stubColumnCount} key={index} />
    ))}
  </thead>
);

ListTableHeader.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      children: PropTypes.array,
    })
  ).isRequired,
  stubColumnCount: PropTypes.number.isRequired,
};

const ListTableHeaderRow = ({ row, rowIndex, stubColumnCount }) => (
  <tr className={rowIndex % 2 === 0 ? 'row-odd' : 'row-even'}>
    {row.map((column, colIndex) => (
      <th className={`head ${colIndex <= stubColumnCount - 1 && 'stub'}`} key={colIndex}>
        {column.children[0].children[0].value}
      </th>
    ))}
  </tr>
);

ListTableHeaderRow.propTypes = {
  row: PropTypes.arrayOf(
    PropTypes.shape({
      children: PropTypes.arrayOf(
        PropTypes.shape({
          children: PropTypes.arrayOf(
            PropTypes.shape({
              value: PropTypes.string.isRequired,
            })
          ),
        })
      ),
    })
  ).isRequired,
  rowIndex: PropTypes.number.isRequired,
  stubColumnCount: PropTypes.number.isRequired,
};

const ListTableBody = ({ rows, headerRowCount, stubColumnCount }) => (
  <tbody valign="top">
    {rows.map((row, index) => (
      <ListTableBodyRow
        key={index}
        row={row.children[0].children}
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
      children: PropTypes.array,
    })
  ).isRequired,
  stubColumnCount: PropTypes.number.isRequired,
};

const ListTableBodyRow = ({ row, rowIndex, stubColumnCount }) => (
  <tr className={rowIndex % 2 === 0 ? 'row-odd' : 'row-even'}>
    {row.map((column, colIndex) => (
      <td className={`${colIndex <= stubColumnCount - 1 && 'stub'}`} key={colIndex}>
        {column.children[0].children[0].value}
      </td>
    ))}
  </tr>
);

ListTableBodyRow.propTypes = {
  row: PropTypes.arrayOf(
    PropTypes.shape({
      children: PropTypes.arrayOf(
        PropTypes.shape({
          children: PropTypes.arrayOf(
            PropTypes.shape({
              value: PropTypes.string.isRequired,
            })
          ),
        })
      ),
    })
  ).isRequired,
  rowIndex: PropTypes.number.isRequired,
  stubColumnCount: PropTypes.number.isRequired,
};

ListTable.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
    options: PropTypes.shape({
      class: PropTypes.string,
      'header-rows': PropTypes.number,
      'stub-columns': PropTypes.number,
      widths: PropTypes.string,
    }),
  }).isRequired,
};

export default ListTable;
