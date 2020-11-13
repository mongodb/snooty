import React from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Cell, TableHeader, HeaderRow, DataType } from '@leafygreen-ui/table';
import { css, cx } from '@leafygreen-ui/emotion';
// import { css, cx } from '@emotion/core';
import ComponentFactory from './ComponentFactory';
import CSSWrapper from './CSSWrapper';
import { getNestedValue } from '../utils/get-nested-value';

const ListTable = ({ nodeData, nodeData: { children, options }, ...rest }) => {
  const headerRowCount = parseInt(options?.['header-rows'], 10) || 0;
  const stubColumnCount = parseInt(options?.['stub-columns'], 10) || 0;
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
    <Table
      className={['docutils', getNestedValue(['options', 'class'], nodeData) || '', widths, customAlign].join(' ')}
      columns={headerRows.map((row, rowIndex) => {
        console.log(row);
        return (
          <HeaderRow key={rowIndex}>
            {row.children.map((column, colIndex) => (
              <TableHeader
                className={`head ${colIndex <= stubColumnCount - 1 && 'stub'}`}
                key={`${rowIndex}-${colIndex}`}
                label={column.children.map((child, i) => (
                  <ComponentFactory {...rest} key={i} nodeData={child} />
                ))}
              />
            ))}
          </HeaderRow>
        );
      })}
      css={css`
        width: ${customWidth};
      `}
      data={bodyRows}
    >
      {/* widths === 'colwidths-given' && <ColGroup widths={customWidths.split(/[ ,]+/)} /> */}
      {/* <ListTableHeader {...rest} rows={headerRows} stubColumnCount={stubColumnCount} /> */}
      {/* <ListTableBody {...rest} rows={bodyRows} headerRowCount={headerRowCount} stubColumnCount={stubColumnCount} /> */}
      {({ datum }) => {
        const row = getNestedValue(['children', 0, 'children'], datum);
        return (
          <Row>
            {row.map((column, colIndex) => {
              const isStub = colIndex <= stubColumnCount - 1;
              const cellClass = isStub ? 'stub' : '';
              console.log(column.children);
              const contents = column.children.map((child, i) => (
                <ComponentFactory {...rest} key={`${colIndex}-${i}`} nodeData={child} />
              ));
              return (
                <Cell
                  key={colIndex}
                  className={cx(css`
                    & > div > span:first-child {
                      margin-top: 0 !important;
                    }
                    & > div > span:last-child {
                      margin-bottom: 0;
                    }
                  `)}
                >
                  {contents}
                </Cell>
              );
            })}
          </Row>
        );
      }}
    </Table>
  );
};

/* const ColGroup = ({ widths }) => (
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
    {row &&
      row.map((column, colIndex) => {
        let isStub = colIndex <= stubColumnCount - 1;
        const CellTag = isStub ? 'th' : 'td';
        let cellClass = isStub ? 'stub' : '';
        return (
          <CellTag className={cellClass} key={colIndex}>
            {column.children.length === 1 ? (
              <CSSWrapper className={['first', 'last'].join(' ')}>
                <ComponentFactory {...rest} nodeData={getNestedValue(['children', 0], column)} parentNode="listTable" />
              </CSSWrapper>
            ) : (
              column.children.map((element, index) => {
                if (index === 0) {
                  return (
                    <CSSWrapper key={index} className="first">
                      <ComponentFactory {...rest} nodeData={element} />
                    </CSSWrapper>
                  );
                }
                if (index === column.children.length - 1) {
                  return (
                    <CSSWrapper key={index} className="last">
                      <ComponentFactory {...rest} nodeData={element} />
                    </CSSWrapper>
                  );
                }
                return <ComponentFactory {...rest} key={index} nodeData={element} />;
              })
            )}
          </CellTag>
        );
      })}
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
}; */

export default ListTable;
