import React from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Cell, TableHead, HeaderRow, TableBody, HeaderCell } from '@leafygreen-ui/table';
import { palette } from '@leafygreen-ui/palette';
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
  margin: ${theme.size.medium} 0;

  table & {
    margin: 0;
  }
`;

/* When using an empty <thead> as required by LeafyGreen, unstyle it to the best of our ability */
const unstyleThead = css`
  & * {
    border: 0 !important;
    min-height: unset !important;
    padding: 0 !important;
  }
`;

const tableRowStyle = css``;

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
            padding: 10px 8px;

            /* Force top alignment rather than LeafyGreen default middle (PD-1217) */
            vertical-align: top;

            > div {
              max-height: unset;
              min-height: unset;
              line-height: 20px;
            }

            /* Apply grey background to stub <th> cells (PD-1216) */
            ${isStub && `background-clip: padding-box; background-color: ${palette.gray.light3};`}

            * {
              font-size: ${theme.fontSize.small} !important;
            }

            & > div {
              max-height: unset;
              display: block;
              align-items: start;
            }
          `)}
          isHeader={isStub}
          key={colIndex}
        >
          <div>{contents}</div>
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

  //TODO: generate unique component ID for table, row, column

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
        // columns={headerRows.map((row, rowIndex) => (
        //   <HeaderRow key={rowIndex} className={cx(headerRowCount === 0 ? unstyleThead : null)}>
        //     {row.children.map((cell, colIndex) => {
        //       const skipPTag = hasOneChild(cell.children);
        //       return (
        //         <TableHead
        //           className={cx(css`
        //             * {
        //               font-size: ${theme.fontSize.small};
        //               font-weight: 600;
        //             }
        //             ${widths && `width: ${widths[colIndex]}%`}
        //           `)}
        //           key={`${rowIndex}-${colIndex}`}
        //           label={cell.children.map((child, i) => (
        //             <ComponentFactory {...rest} key={i} nodeData={child} skipPTag={skipPTag} />
        //           ))}
        //         />
        //       );
        //     })}
        //   </HeaderRow>
        // ))}
        data={bodyRows}
      >
        <TableHead>
          {/* <HeaderRow key="1" className={cx(headerRowCount === 0 ? unstyleThead : null)}>
            {dummyArr.map((element) => {
              console.log('ELEMENT HERE: ', element);
              return (
                <HeaderCell key={element} columnName={element}>
                  {element}
                </HeaderCell>
              );
            })}
          </HeaderRow> */}
          {headerRows.map((row, rowIndex) => (
            <HeaderRow key={rowIndex} className={cx(headerRowCount === 0 ? unstyleThead : null)}>
              {row.children.map((cell, colIndex) => {
                const skipPTag = hasOneChild(cell.children);
                return (
                  <HeaderCell
                    className={cx(css`
                      * {
                        font-size: ${theme.fontSize.small};
                        font-weight: 600;
                        height: unset;
                      }
                      line-height: 24px;
                      height: unset;
                      padding: 10px 8px;

                      ${widths && `width: ${widths[colIndex]}%`}
                    `)}
                    key={`${rowIndex}-${colIndex}`}
                    // label={cell.children.map((child, i) => (
                    //   <ComponentFactory {...rest} key={i} nodeData={child} skipPTag={skipPTag} />
                    // ))}
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
            <ListTableRow {...rest} stubColumnCount={stubColumnCount} row={row?.children?.[0]?.children} />
          ))}
        </TableBody>
        {/* {listTableRow(datum)} */}
        {/* {({ datum }) => (
            <ListTableRow {...rest} stubColumnCount={stubColumnCount} row={datum?.children?.[0]?.children} />
          )()} */}
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
