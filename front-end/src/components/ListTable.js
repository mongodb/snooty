import React from 'react';
import PropTypes from 'prop-types';

const ListTable = ({ nodeData: { children, options } }) => {
  const headerRowCount = parseInt(options['header-rows'], 10);
  const stubColumnCount = parseInt(options['stub-columns'], 10);
  const headerRows = children[0].children[0].children.slice(0, headerRowCount);
  const bodyRows = children[0].children.slice(headerRowCount);
  let widths = '';
  if (options.widths) {
    widths = options.widths === 'auto' ? 'colwidths-auto' : 'colwidths-given';
  }

  return (
    <table className={`docutils ${options.class} ${widths}`}>
      {widths === 'colwidths-given' && <Colgroup widths={options.widths.split(/[ ,]+/)} />}
      <ListTableHeader rows={headerRows} stubColumnCount={stubColumnCount} />
      <ListTableBody rows={bodyRows} headerRowCount={headerRowCount} stubColumnCount={stubColumnCount} />
    </table>
  );
};

const Colgroup = ({ widths }) => (
  <colgroup>
    {widths.map(width => (
      <col width={`${width}%`} />
    ))}
  </colgroup>
);

Colgroup.propTypes = {
  widths: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const ListTableHeader = ({ rows, stubColumnCount }) => (
  <thead valign="bottom">
    {rows.map((row, index) => (
      <ListTableHeaderRow row={row.children} rowIndex={index} stubColumnCount={stubColumnCount} />
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
      <th className={`head ${colIndex <= stubColumnCount - 1 && 'stub'}`}>{column.children[0].children[0].value}</th>
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
      <td className={`${colIndex <= stubColumnCount - 1 && 'stub'}`}>{column.children[0].children[0].value}</td>
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
      'header-rows': PropTypes.string,
      'stub-columns': PropTypes.string,
      widths: PropTypes.string,
    }),
  }).isRequired,
};

export default ListTable;
