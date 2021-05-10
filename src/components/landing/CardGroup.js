import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const getColumnValue = (props) => props.columns || React.Children.count(props.children);

const carouselStyling = ({ children, theme }) => css`
  grid-gap: calc(${theme.size.medium} * 0.75);
  grid-template-columns:
    calc(${theme.size.medium} / 2) repeat(${React.Children.count(children)}, calc(75% - calc(2 * ${theme.size.medium})))
    calc(${theme.size.medium} / 2);
  grid-template-rows: minmax(150px, 1fr);
  margin: ${theme.size.medium} 0;
  overflow-x: scroll;
  padding-bottom: calc(${theme.size.medium} / 2);
  scroll-snap-type: x proximity;

  &:before,
  &:after {
    content: '';
  }
`;

const StyledGrid = styled('div')`
  align-items: stretch;
  display: grid;
  grid-column: 1/-1 !important;
  grid-column-gap: ${({ theme }) => theme.size.medium};
  grid-row-gap: ${({ theme }) => theme.size.medium};
  grid-template-columns: ${(props) => `repeat(${getColumnValue(props)}, 1fr)`};
  margin: ${({ theme }) => theme.size.large} 0;

  @media ${({ theme }) => theme.screenSize.upToLarge} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${({ theme }) => theme.screenSize.upToMedium} {
    ${({ isCarousel, ...props }) => (isCarousel ? carouselStyling(props) : 'grid-template-columns: repeat(1, 1fr);')}
  }
`;

const CardGroup = ({
  nodeData: {
    children,
    options: { columns, layout, style },
  },
  ...rest
}) => {
  const isCompact = style === 'compact';
  const isExtraCompact = style === 'extra-compact';
  const isCarousel = layout === 'carousel';
  return (
    <StyledGrid className="card-group" columns={columns} noMargin={true} isCarousel={isCarousel}>
      {children.map((child, i) => (
        <ComponentFactory {...rest} key={i} nodeData={child} isCompact={isCompact} isExtraCompact={isExtraCompact} />
      ))}
    </StyledGrid>
  );
};

CardGroup.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.shape({
      columns: PropTypes.number,
      style: PropTypes.string,
    }),
  }).isRequired,
};

export default CardGroup;
