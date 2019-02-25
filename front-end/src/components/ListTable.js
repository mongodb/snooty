import React from 'react';
import PropTypes from 'prop-types';

const ListTable = ({ nodeData: { children, options } }) => {
  console.log(options);
  const headerRowCount = options['header-rows'];
  const headerRows = children[0].children[0].children.slice(0, headerRowCount);
  const bodyRows = children[0].children.slice(headerRowCount);
  return (
    <table className={`docutils ${options.class}`}>
      <ListTableHeader rows={headerRows} />
      <ListTableBody rows={bodyRows} headerRowCount={headerRowCount} />
    </table>
  );
};

const ListTableHeader = ({ rows }) => (
  <thead valign="bottom">
    {rows.map((row, index) => (
      <ListTableHeaderRow row={row.children} index={index} />
    ))}
  </thead>
);

const ListTableHeaderRow = ({ row, index }) => (
  <tr className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
    {row.map(column => (
      <th className="head">{column.children[0].children[0].value}</th>
    ))}
  </tr>
);

const ListTableBody = ({ rows, headerRowCount }) => (
  <tbody valign="top">
    {rows.map((row, index) => (
      <ListTableBodyRow row={row.children[0].children} index={index + headerRowCount} />
    ))}
  </tbody>
);

const ListTableBodyRow = ({ row, index }) => (
  <tr className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
    {row.map(column => (
      <td>{column.children[0].children[0].value}</td>
    ))}
  </tr>
);

ListTable.propTypes = {};

export default ListTable;
