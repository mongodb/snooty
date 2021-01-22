import React from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Cell, TableHeader, HeaderRow } from '@leafygreen-ui/table';
import { css, cx } from '@leafygreen-ui/emotion';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

const align = key => {
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

const hasOneChild = children => children.length === 1 && children[0].type === 'paragraph';

const ListTable = ({ nodeData, nodeData: { children, options }, slug, ...rest }) => {
  const headerRowCount = parseInt(options?.['header-rows'], 10) || 0;
  const stubColumnCount = parseInt(options?.['stub-columns'], 10) || 0;
  const headerRows = children[0].children[0].children.slice(0, headerRowCount);
  const bodyRows = children[0].children.slice(headerRowCount);

  let widths = null;
  const customWidths = getNestedValue(['options', 'widths'], nodeData);
  if (customWidths && customWidths !== 'auto') {
    widths = customWidths.split(/[ ,]+/);
    if (bodyRows && bodyRows[0].length !== widths.length) {
      // If custom width specification does not match number of columns, do not apply
      widths = null;
    }
  }

  return (
    <Table
      className={cx(
        styleTable({
          customAlign: options?.align,
          customWidth: options?.width,
        })
      )}
      columns={headerRows.map((row, rowIndex) => (
        <HeaderRow key={rowIndex}>
          {row.children.map((cell, colIndex) => {
            const skipPTag = hasOneChild(cell.children);
            return (
              <TableHeader
                className={cx(css`
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
      {({ datum }) => {
        const row = getNestedValue(['children', 0, 'children'], datum);
        return (
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
                    /* TODO: Increase margin when Table component supports base font size of 16px */
                    & > div > span > * {
                      margin: 0 0 10px;
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
      }}
    </Table>
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
