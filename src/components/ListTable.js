import React from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Cell, TableHeader, HeaderRow } from '@leafygreen-ui/table';
import { uiColors } from '@leafygreen-ui/palette';
import { css, cx } from '@leafygreen-ui/emotion';
import { theme } from '../theme/docsTheme';
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
`;

/* When using an empty <thead> as required by LeafyGreen, unstyle it to the best of our ability */
const unstyleThead = css`
  & * {
    border: 0 !important;
    min-height: unset !important;
    padding: 0 !important;
  }
`;

const hiddenContainerStyle = css``;

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

const ListTableRow = ({ row = [], stubColumnCount, ...rest }) => (
  <Row>
    {row.map((cell, colIndex) => {
      const isStub = colIndex <= stubColumnCount - 1;
      const skipPTag = hasOneChild(cell.children);
      const contents = cell.children.map((child, i) => (
        <ComponentFactory {...rest} key={`${colIndex}-${i}`} nodeData={child} skipPTag={skipPTag} />
      ));
      return (
        <Cell
          className={cx(css`
            overflow-wrap: anywhere;
            word-break: break-word;

            /* Force top alignment rather than LeafyGreen default middle (PD-1217) */
            vertical-align: top;

            /* Apply grey background to stub <th> cells (PD-1216) */
            ${isStub && `background-clip: padding-box; background-color: ${uiColors.gray.light3};`}

            * {
              font-size: ${theme.fontSize.small} !important;
            }

            & > div {
              align-items: start;
            }

            & > div > span > * {
              margin: 0 0 12px;
            }

            /* Prevent extra margin below last element */
            & > div > span > *:last-child {
              margin-bottom: 0;
            }
          `)}
          isHeader={isStub}
          key={colIndex}
        >
          {contents}
        </Cell>
      );
    })}
  </Row>
);

ListTableRow.propTypes = {
  row: PropTypes.arrayOf(PropTypes.object),
  stubColumnCount: PropTypes.number.isRequired,
};

const ListTable = ({ nodeData: { children, options }, ...rest }) => {
  const headerRowCount = parseInt(options?.['header-rows'], 10) || 0;
  const stubColumnCount = parseInt(options?.['stub-columns'], 10) || 0;
  const bodyRows = children[0].children.slice(headerRowCount);
  const columnCount = bodyRows[0].children[0].children.length;

  // If :header-rows: 0 is specified or :header-rows: is omitted, spoof empty <thead> content to avoid LeafyGreen component crashing
  const headerRows =
    headerRowCount > 0
      ? children[0].children[0].children.slice(0, headerRowCount)
      : [{ children: Array(columnCount).fill({ type: 'text', value: '', children: [] }) }];

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
  const elmIdsForScroll = getReferenceIds(headerRows[0].children.concat(bodyRows.slice(0, 3)));

  return (
    <>
      <div className={cx(hiddenContainerStyle)}>
        {elmIdsForScroll.map((id) => (
          <div className="header-buffer" key={id} id={id} />
        ))}
      </div>
      <Table
        className={cx(
          styleTable({
            customAlign: options?.align,
            customWidth: options?.width,
          })
        )}
        columns={headerRows.map((row, rowIndex) => (
          <HeaderRow key={rowIndex} className={cx(headerRowCount === 0 ? unstyleThead : null)}>
            {row.children.map((cell, colIndex) => {
              const skipPTag = hasOneChild(cell.children);
              return (
                <TableHeader
                  className={cx(css`
                    * {
                      font-size: ${theme.fontSize.small};
                    }
                    ${widths && `width: ${widths[colIndex]}%`}
                  `)}
                  key={`${rowIndex}-${colIndex}`}
                  label={cell.children.map((child, i) => (
                    <ComponentFactory {...rest} key={i} nodeData={child} skipPTag={skipPTag} />
                  ))}
                />
              );
            })}
          </HeaderRow>
        ))}
        data={bodyRows}
      >
        {({ datum }) => (
          <ListTableRow {...rest} stubColumnCount={stubColumnCount} row={datum?.children?.[0]?.children} />
        )}
      </Table>
    </>
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
