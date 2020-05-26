import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const StyledGrid = styled('div')`
  display: grid;
  grid-column: 1/-1 !important;
  grid-column-gap: ${({ theme }) => theme.size.medium};
  grid-row-gap: ${({ theme }) => theme.size.medium};
  grid-template-columns: ${({ columns = 1 }) => `repeat(${columns}, 1fr)`};
  margin: ${({ theme }) => theme.size.xlarge} 0;

  @media ${({ theme }) => theme.screenSize.upToLarge} {
    align-items: initial;
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${({ theme }) => theme.screenSize.upToMedium} {
    grid-template-columns: ${({ children, theme }) =>
      `repeat(${React.Children.count(children)}, calc(75% - calc( 2 * ${theme.size.medium})))`};
    grid-template-rows: minmax(150px, 1fr);
    grid-gap: ${({ theme }) => theme.size.medium};
    overflow-x: scroll;

    & > a:last-child {
      margin-right: ${({ theme }) => theme.size.medium};
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

export default CardGroup;
