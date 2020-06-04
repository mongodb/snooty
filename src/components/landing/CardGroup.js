import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const getColumnValue = props => props.columns || React.Children.count(props.children);

const StyledGrid = styled('div')`
  align-items: stretch;
  display: grid;
  grid-column: 1/-1 !important;
  grid-column-gap: ${({ theme }) => theme.size.medium};
  grid-row-gap: ${({ theme }) => theme.size.medium};
  grid-template-columns: ${props => `repeat(${getColumnValue(props)}, 1fr)`};
  margin: ${({ theme }) => theme.size.large} 0;

  @media ${({ theme }) => theme.screenSize.upToLarge} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${({ theme }) => theme.screenSize.upToMedium} {
    grid-gap: ${({ theme }) => `calc(${theme.size.medium} * 0.75)`};
    grid-template-columns: ${({ children, theme }) =>
      `calc(${theme.size.medium} / 2) repeat(${React.Children.count(children)}, calc(75% - calc( 2 * ${
        theme.size.medium
      }))) calc(${theme.size.medium} / 2)`};
    grid-template-rows: minmax(150px, 1fr);
    margin: ${({ theme }) => theme.size.medium} 0;
    overflow-x: scroll;
    padding-bottom: ${({ theme }) => `calc(${theme.size.medium} / 2)`};
    scroll-snap-type: x proximity;

    &:before,
    &:after {
      content: '';
    }
  }
`;

const CardGroup = ({
  nodeData: {
    children,
    options: { columns },
  },
  ...rest
}) => (
  <StyledGrid columns={columns} noMargin={true}>
    {children.map(child => (
      <ComponentFactory nodeData={child} {...rest} />
    ))}
  </StyledGrid>
);

CardGroup.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.shape({
      columns: PropTypes.number,
    }),
  }).isRequired,
};

export default CardGroup;
