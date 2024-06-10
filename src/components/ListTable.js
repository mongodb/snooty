import React from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Cell, TableHeader, HeaderRow } from '@leafygreen-ui/table';
import { palette } from '@leafygreen-ui/palette';
import { css, cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';

const CUSTOM_THEME_STYLES = {
  // Need to redefine original styling to avoid undefined values. Needed while custom dark mode row styling exists
  light: {
    '--background-color': palette.white,
    '--zebra-stripe-color': palette.gray.light3,
  },
  // Temporary workaround to overwrite certain styling for dark mode due to difficulties with LG Table version upgrade (DOP-3614)
  dark: {
    '--background-color': palette.black,
    '--zebra-stripe-color': palette.gray.dark4,
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

const styleTable = ({ customAlign, customWidth, overrideZebraStripes }) => css`
  ${customAlign && `text-align: ${align(customAlign)}`};
  ${customWidth && `width: ${customWidth}`};
  margin: ${theme.size.medium} 0;
  // Font family was incorrect for certain tables in dark mode, most likely due to outdated component
  font-family: 'Euclid Circular A', 'Helvetica Neue', Helvetica, Arial, sans-serif;

  table & {
    margin: 0;
  }

  tbody > tr:nth-of-type(even) {
    // Overriding bg color for dark mode rows prevents zebra striping. Adding this rule to restore zebra striping
    ${overrideZebraStripes && `background-color: var(--zebra-stripe-color);`}
  }

  // This CSS target is the same one LG uses to force one of their styles. Use the same one to prevent it from overriding
  // our styles https://github.com/mongodb/leafygreen-ui/blob/bc02626ea8779407b56a481a989e6b0f0bcd624c/packages/table/src/Row.tsx#L74
  tbody > tr:nth-of-type(odd) > th {
    ${overrideZebraStripes && `background-color: inherit;`}
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

const backgroundColorStyle = css`
  background-color: var(--background-color);
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

const ListTableRow = ({ row = [], stubColumnCount, colorTheme, ...rest }) => (
  <Row
    className={cx(backgroundColorStyle)}
    style={{ '--background-color': CUSTOM_THEME_STYLES[colorTheme]['--background-color'] }}
  >
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
            ${isStub && `background-clip: padding-box; background-color: var(--stub-bg-color);`}

            * {
              font-size: ${theme.fontSize.small} !important;
            }

            & > div {
              align-items: start;
            }

            & > div > span {
              display: block;
              align-self: center;
            }

            & > div > span > *,
            & > div > span p {
              margin: 0 0 12px;
              line-height: inherit;
            }

            /* Prevent extra margin below last element */
            & > div > span > *:last-child {
              margin-bottom: 0;
            }
          `)}
          style={{ ...(isStub && { '--stub-bg-color': CUSTOM_THEME_STYLES[colorTheme]['--zebra-stripe-color'] }) }}
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
  const { darkMode } = useDarkMode();
  const colorTheme = darkMode ? 'dark' : 'light';
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
      {elmIdsForScroll.map((id) => (
        <div className="header-buffer" key={id} id={id} />
      ))}
      <Table
        className={cx(
          styleTable({
            customAlign: options?.align,
            customWidth: options?.width,
            overrideZebraStripes: bodyRows.length > 10,
          })
        )}
        style={{
          ...CUSTOM_THEME_STYLES[colorTheme],
        }}
        columns={headerRows.map((row, rowIndex) => (
          <HeaderRow key={rowIndex} className={cx(headerRowCount === 0 ? unstyleThead : null)}>
            {row.children.map((cell, colIndex) => {
              const skipPTag = hasOneChild(cell.children);
              return (
                <TableHeader
                  className={cx(
                    css`
                      * {
                        font-size: ${theme.fontSize.small};
                        font-weight: 600;
                      }
                      ${widths && `width: ${widths[colIndex]}%`}
                    `,
                    backgroundColorStyle
                  )}
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
        darkMode={darkMode}
      >
        {({ datum }) => (
          <ListTableRow
            {...rest}
            stubColumnCount={stubColumnCount}
            row={datum?.children?.[0]?.children}
            darkMode={darkMode}
            colorTheme={colorTheme}
          />
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
