import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Cell, HeaderCell, HeaderRow, Row, Table, TableBody, TableHead } from '@leafygreen-ui/table';
import { palette } from '@leafygreen-ui/palette';
import { css, cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { Theme } from '@leafygreen-ui/lib';
import { theme } from '../theme/docsTheme';
import { AncestorComponentContextProvider, useAncestorComponentContext } from '../context/ancestor-components-context';
import ComponentFactory from './ComponentFactory';

// Need to define custom styles for custom components, such as stub cells
const LIST_TABLE_THEME_STYLES = {
  [Theme.Light]: {
    stubCellBgColor: palette.gray.light3,
    stubBorderColor: palette.gray.light2,
  },
  [Theme.Dark]: {
    stubCellBgColor: palette.gray.dark4,
    stubBorderColor: palette.gray.dark2,
  },
};

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
`;

const baseCellStyle = css`
  // Keep legacy padding; important to prevent first-child and last-child overwrites
  padding: 10px ${theme.size.small} !important;
  // Force top alignment rather than LeafyGreen default middle (PD-1217)
  vertical-align: top;

  * {
    // Wrap in selector to ensure it cascades down to every element
    font-size: ${theme.fontSize.small} !important;
    line-height: inherit;
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

  * {
    line-height: 20px;
  }

  // Target any nested components (paragraphs, admonitions, tables) and any paragraphs within those nested components
  & > div > div > *,
  & > div > div p {
    margin: 0 0 12px;
  }

  // Prevent extra margin below last element (such as when multiple paragraphs are present)
  & > div > div > *:last-child {
    margin-bottom: 0;
  }
`;

const headerCellStyle = css`
  line-height: 24px;
  font-weight: 600;
  font-size: ${theme.fontSize.small};
`;

const stubCellStyle = ({ stubCellBgColor, stubBorderColor }) => css`
  background-color: ${stubCellBgColor};
  border-right: 3px solid ${stubBorderColor};
  font-weight: 600;
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

const ListTableRow = ({ row = [], stubColumnCount, siteTheme, ...rest }) => (
  <Row>
    {row.map((cell, colIndex) => {
      const skipPTag = hasOneChild(cell.children);
      const contents = cell.children.map((child, i) => (
        <ComponentFactory {...rest} key={`${colIndex}-${i}`} nodeData={child} skipPTag={skipPTag} />
      ));

      const isStub = colIndex <= stubColumnCount - 1;
      const role = isStub ? 'rowheader' : null;

      return (
        <Cell
          key={colIndex}
          className={cx(baseCellStyle, bodyCellStyle, isStub && stubCellStyle(LIST_TABLE_THEME_STYLES[siteTheme]))}
          role={role}
        >
          {/* Wrap in div to ensure contents are structured properly */}
          <div>{contents}</div>
        </Cell>
      );
    })}
  </Row>
);

ListTableRow.propTypes = {
  row: PropTypes.arrayOf(PropTypes.object),
  stubColumnCount: PropTypes.number.isRequired,
  siteTheme: PropTypes.oneOf(Object.values(Theme)).isRequired,
};

const ListTable = ({ nodeData: { children, options }, ...rest }) => {
  const ancestors = useAncestorComponentContext();
  const { theme: siteTheme } = useDarkMode();
  const headerRowCount = parseInt(options?.['header-rows'], 10) || 0;
  const stubColumnCount = parseInt(options?.['stub-columns'], 10) || 0;
  const bodyRows = children[0].children.slice(headerRowCount);
  const columnCount = bodyRows[0].children[0].children.length;

  // Check if :header-rows: 0 is specified or :header-rows: is omitted
  const headerRows = headerRowCount > 0 ? children[0].children[0].children.slice(0, headerRowCount) : [];

  let widths = null;
  const customWidths = options?.widths;
  if (customWidths && customWidths !== 'auto') {
    widths = customWidths.split(/[ ,]+/);
    if (columnCount !== widths.length) {
      // If custom width specification does not match number of columns, do not apply
      widths = null;
    }
  }

  // get all ID's for elements within header, or first two rows of body
  const firstHeaderRowChildren = headerRows[0]?.children ?? [];
  const elmIdsForScroll = getReferenceIds(firstHeaderRowChildren.concat(bodyRows.slice(0, 3)));

  const hasNestedTable = useMemo(() => includesNestedTable(bodyRows), [bodyRows]);
  const noTableNesting = !hasNestedTable && !ancestors?.table;

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
        shouldAlternateRowColor={noTableNesting && bodyRows.length > 4}
      >
        {widths && (
          <colgroup>
            {widths.map((width, i) => (
              <col key={i} style={{ width: `${width}%` }} />
            ))}
          </colgroup>
        )}
        <TableHead className={cx(theadStyle)}>
          {headerRows.map((row, rowIndex) => (
            <HeaderRow key={rowIndex} data-testid="leafygreen-ui-header-row">
              {row.children.map((cell, colIndex) => {
                const skipPTag = hasOneChild(cell.children);
                return (
                  <HeaderCell
                    className={cx(baseCellStyle, headerCellStyle)}
                    key={`${rowIndex}-${colIndex}`}
                    role="columnheader"
                  >
                    <div>
                      {cell.children.map((child, i) => (
                        <ComponentFactory {...rest} key={i} nodeData={child} skipPTag={skipPTag} />
                      ))}
                    </div>
                  </HeaderCell>
                );
              })}
            </HeaderRow>
          ))}
        </TableHead>
        <TableBody>
          {bodyRows.map((row, i) => (
            <ListTableRow
              key={i}
              {...rest}
              stubColumnCount={stubColumnCount}
              row={row.children?.[0]?.children}
              siteTheme={siteTheme}
            />
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
