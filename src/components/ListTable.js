import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Cell,
  HeaderCell,
  flexRender,
  HeaderRow,
  Row,
  Table,
  TableBody,
  TableHead,
  useLeafyGreenTable,
} from '@leafygreen-ui/table';
import { palette } from '@leafygreen-ui/palette';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../theme/docsTheme';
import { AncestorComponentContextProvider, useAncestorComponentContext } from '../context/ancestor-components-context';
import ComponentFactory from './ComponentFactory';

const align = (key) => {
  switch (key) {
    case 'left':
    case 'right':
    case 'center':
      return key;
    default:
      return 'inherit';
  }
};

const styleTable = ({ customAlign, customWidth }) => css`
  ${customAlign && `text-align: ${align(customAlign)}`};
  ${customWidth && `width: ${customWidth}`};
  margin: ${theme.size.medium} 0;
`;

const theadStyle = css`
  // Allows its box shadow to appear above stub cell's background color
  position: relative;
  color: var(--font-color-primary);
  background-color: ${palette.white};
  box-shadow: 0 ${theme.size.tiny} ${palette.gray.light2};

  .dark-theme & {
    background-color: ${palette.black};
    box-shadow: 0 ${theme.size.tiny} ${palette.gray.dark2};
  }
`;

const baseCellStyle = css`
  // Keep legacy padding; important to prevent first-child and last-child overwrites
  padding: 10px ${theme.size.small} !important;
  // Force top alignment rather than LeafyGreen default middle (PD-1217)
  vertical-align: top;
  color: var(--font-color-primary);

  * {
    // Wrap in selector to ensure it cascades down to every element
    font-size: ${theme.fontSize.small} !important;
  }

  // Ensure each cell is no higher than the highest content in row
  & > div {
    height: unset;
    min-height: unset;
  }
`;

const bodyCellStyle = css`
  overflow-wrap: anywhere;
  word-break: break-word;
  align-content: flex-start;

  & > div {
    min-height: unset;
    max-height: unset;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const bodyCellContentStyle = css`
  *,
  p,
  a {
    line-height: 20px;
  }

  // Target any nested components (paragraphs, admonitions, tables) and any paragraphs within those nested components
  & > *,
  & > div p {
    margin: 0 0 12px !important;
  }

  // Prevent extra margin below last element (such as when multiple paragraphs are present)
  & > div *:last-child,
  & > *:last-child {
    margin-bottom: 0 !important;
  }
`;

const headerCellStyle = css`
  line-height: 24px;
  font-weight: 600;
  font-size: ${theme.fontSize.small};
  width: auto;
`;

const stubCellStyle = css`
  background-color: ${palette.gray.light3};
  border-right: 3px solid ${palette.gray.light2};
  font-weight: 600;

  .dark-theme & {
    background-color: ${palette.gray.dark4};
    border-right: 3px solid ${palette.gray.dark2};
  }
`;

const zebraStripingStyle = css`
  &:nth-of-type(even) {
    background-color: ${palette.gray.light3};

    .dark-theme & {
      background-color: ${palette.gray.dark4};
    }
  }
`;

const hasOneChild = (children) => children.length === 1 && children[0].type === 'paragraph';

/**
 * recursive traversal of nodeLists' children to look for
 * id values of footnote references
 *
 * @param nodeList @node[]
 * @returns str[]
 */
const getReferenceIds = (nodeList) => {
  const referenceType = `footnote_reference`;
  const results = [];
  const iter = (node) => {
    if (node['type'] === referenceType) {
      results.push(`ref-${node['refname']}-${node['id']}`);
    }
    if (!node.children || !node.children.length) {
      return;
    }
    for (let childNode of node.children) {
      iter(childNode);
    }
  };

  for (let node of nodeList) {
    iter(node);
  }
  return results;
};

/**
 * Checks every row for the existence of a nested table.
 * @param {object[]} rows
 * @returns {boolean}
 */
const includesNestedTable = (rows) => {
  const checkNodeForTable = (nodeData) => {
    if (nodeData.type === 'directive' && nodeData.name === 'list-table') {
      return true;
    }

    if (!nodeData.children || nodeData.children === 0) {
      return false;
    }

    return nodeData.children.some((node) => checkNodeForTable(node));
  };

  return rows.some((row) => checkNodeForTable(row));
};

const generateColumns = (headerRow, bodyRows) => {
  if (!headerRow?.children) {
    // generate columns from bodyRows
    const flattenedRows = bodyRows.map((bodyRow) => bodyRow.children[0].children);
    const maxColumns = Math.max(...flattenedRows.map((row) => row.length));
    const res = [];
    for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
      res.push({
        id: `column-${colIndex}`,
        accessorKey: `column-${colIndex}`,
        header: '',
      });
    }
    return res;
  }

  return headerRow.children.map((listItemNode, index) => {
    const skipPTag = hasOneChild(listItemNode.children);
    return {
      id: `column-${index}`,
      accessorKey: `column-${index}`,
      header: (
        <>
          {listItemNode.children.map((childNode, index) => (
            <ComponentFactory key={index} nodeData={childNode} skipPTag={skipPTag} />
          ))}
        </>
      ),
    };
  });
};

const generateRowsData = (bodyRowNodes, columns) => {
  const rowNodes = bodyRowNodes.map((node) => node?.children[0]?.children ?? []);
  const rows = rowNodes.map((rowNode) => {
    return rowNode.reduce((res, columnNode, colIndex) => {
      const column = columns[colIndex];
      if (!column) {
        console.warn(`Row has too many items (index ${colIndex}) for table with ${columns.length} columns`);
        return res;
      }
      res[column?.accessorKey ?? colIndex] = (
        <>
          {columnNode.children.map((cellNode, index) => (
            <ComponentFactory key={index} nodeData={cellNode} />
          ))}
        </>
      );
      return res;
    }, {});
  });

  return rows;
};

const ListTable = ({ nodeData: { children, options }, ...rest }) => {
  const ancestors = useAncestorComponentContext();
  const stubColumnCount = parseInt(options?.['stub-columns'], 10) || 0;
  const headerRowCount = parseInt(options?.['header-rows'], 10) || 0;

  // Check if :header-rows: 0 is specified or :header-rows: is omitted
  const headerRows = useMemo(() => {
    const MAX_HEADER_ROW = 1;
    return headerRowCount > 0
      ? children[0].children[0].children.slice(0, Math.min(MAX_HEADER_ROW, headerRowCount))
      : [];
  }, [children, headerRowCount]);

  const bodyRows = useMemo(() => {
    return children[0].children.slice(headerRowCount);
  }, [children, headerRowCount]);

  // get all ID's for elements within header, or first two rows of body
  const firstHeaderRowChildren = headerRows[0]?.children ?? [];
  const elmIdsForScroll = getReferenceIds(firstHeaderRowChildren.concat(bodyRows.slice(0, 3)));

  const hasNestedTable = useMemo(() => includesNestedTable(bodyRows), [bodyRows]);
  const noTableNesting = !hasNestedTable && !ancestors?.table;
  const shouldAlternateRowColor = noTableNesting && bodyRows.length > 4;

  const tableRef = useRef();
  const columns = useMemo(() => generateColumns(headerRows[0], bodyRows), [bodyRows, headerRows]);
  const data = useMemo(() => generateRowsData(bodyRows, columns), [bodyRows, columns]);
  const table = useLeafyGreenTable({
    containerRef: tableRef,
    columns: columns,
    data: data,
  });
  const { rows } = table.getRowModel();

  const columnCount = columns.length;

  let widths = null;
  const customWidths = options?.widths;
  if (customWidths && customWidths !== 'auto') {
    widths = customWidths.split(/[ ,]+/);
    if (columnCount !== widths.length) {
      // If custom width specification does not match number of columns, do not apply
      widths = null;
    }
  }

  return (
    <AncestorComponentContextProvider component={'table'}>
      {elmIdsForScroll.map((id) => (
        <div className="header-buffer" key={id} id={id} />
      ))}
      <Table
        className={cx(
          styleTable({
            customAlign: options?.align,
            customWidth: options?.width,
          })
        )}
        ref={tableRef}
        shouldAlternateRowColor={shouldAlternateRowColor}
      >
        {widths && (
          <colgroup>
            {widths.map((width, i) => (
              <col key={i} style={{ width: `${width}%` }} />
            ))}
          </colgroup>
        )}
        <TableHead className={cx(theadStyle)}>
          {headerRowCount > 0 &&
            table.getHeaderGroups().map((headerGroup) => (
              <HeaderRow key={headerGroup.id} data-testid="leafygreen-ui-header-row">
                {headerGroup.headers.map((header) => {
                  return (
                    <HeaderCell className={cx(baseCellStyle, headerCellStyle)} key={header.id} header={header}>
                      {/* Wraps cell content inside of a div so that all of its content are together when laid out. */}
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    </HeaderCell>
                  );
                })}
              </HeaderRow>
            ))}
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.id} row={row} className={cx(shouldAlternateRowColor && zebraStripingStyle)}>
              {row.getVisibleCells().map((cell, colIndex) => {
                const isStub = colIndex <= stubColumnCount - 1;
                const role = isStub ? 'rowheader' : null;
                return (
                  <Cell key={cell.id} className={cx(baseCellStyle, bodyCellStyle, isStub && stubCellStyle)} role={role}>
                    {/* Wraps cell content inside of a div so that all of its content are together when laid out. */}
                    <div className={cx(bodyCellContentStyle)}>{cell.renderValue()}</div>
                  </Cell>
                );
              })}
            </Row>
          ))}
        </TableBody>
      </Table>
    </AncestorComponentContextProvider>
  );
};

ListTable.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.shape({
      align: PropTypes.string,
      'header-rows': PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      'stub-columns': PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.string,
      widths: PropTypes.string,
    }),
  }).isRequired,
};

export default ListTable;
