import { css } from '@emotion/core';
import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

/**
 * This component will create a container grid around any valid element(s)
 * Pass a number to the columns prop to create that number of equal width columns.
 *
 * If no columns are passed as a prop we default to the number of children.
 *
 * To specify proportion pass an array with each proportion based on a 12 column grid
 * e.g.
 * columns={3} 3 equal width columns
 * columns {[3, 9]} 2 columns that take up 1/4 and 3/4 of the grid, respectively
 */

// A 12 column base grid
const GRID_BASIS = 12;
const proportionMessage = `Grid proportions must add up to ${GRID_BASIS} (e.g. columns=[3, 6, 3])`;
const typeMessage = `Columns must be an Array or Number`;
const sizeMessage = `${GRID_BASIS} columns or less, please`;
/**
 * grid-template-columns style
 * @param {number} column defaults to 1fr which is a proportional fraction of the grid
 * @return {string} style to pass to `grid-template-columns` per column
 */
const _gridColumnTemplate = (column = 1) => `[col-start] ${column}fr `;

/**
 * Validates that column's value is a number or an array summing to a proporation of 12
 * @param {number|array} columns
 * @return {void} does not return a value
 */
export const _validateColumnProps = columns => {
  if (Array.isArray(columns)) {
    const sum = columns.reduce((a, b) => a + b);
    // columns must be evenly divisible into, and not exceed, GRID_BASIS
    if (sum > GRID_BASIS || (GRID_BASIS / sum) % 1 !== 0) {
      throw new RangeError(proportionMessage);
    }
  } else if (typeof columns !== 'number') {
    throw new TypeError(typeMessage);
    // Do not exceed grid basis
  } else if (columns > GRID_BASIS) {
    throw new RangeError(sizeMessage);
  }
};
/**
 * gets the columns prop value or if not given the number of children
 * @param {object} props
 *    @param {number|array} columns
 *    @param {nodes} children
 * @return {number}
 */
const _getColumnValue = props => props.columns || React.Children.count(props.children);
/**
 *
 * @param {number | array} cols Number of columns or array of proportions
 * @return {string} entire style to pass to `grid-template-columns`
 */
export const _getGridColumnStyles = cols => {
  if (typeof cols === 'number') {
    return `repeat(${cols}, ${_gridColumnTemplate()})`;
  }
  return cols.reduce((acc, column) => acc.concat(`${_gridColumnTemplate(column)} `), '');
};

const _gridStyles = () => css`
  display: grid;
  grid-gap: 12px;
  justify-content: stretch;
`;

const StyledGrid = styled.section`
  grid-template-columns: ${props => _getGridColumnStyles(_getColumnValue(props))};
  margin: ${props => (props.noMargin ? 0 : `12px 5%;`)};
  ${_gridStyles};
`;

const Grid = props => <StyledGrid {...props} />;

Grid.propTypes = {
  /**
   * Child components or elements
   */
  children: PropTypes.node.isRequired,
  /**
   * {Number | Array} Number of columns or array with column proportions based on a 12 column grid. The length of the array specifies the number of columns.
   *
   */
  columns: ({ columns }) => _validateColumnProps(columns),
  /**
   * Remove outer margin. Useful for nested grids
   */
  noMargin: PropTypes.bool,
};

Grid.defaultProps = {
  columns: 0, // defaults to using the number of children
  noMargin: false,
};

export default Grid;
