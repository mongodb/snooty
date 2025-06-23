import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';
import type { CardGroupNode } from '../../types/ast';
import { Page } from '../../context/page-context';

export interface CardGroupProps {
  className?: string;
  nodeData: CardGroupNode;
  page?: Page;
}

interface StyledGridProps {
  isForDrivers: boolean;
  isLanding: boolean;
  columns: number;
  isCarousel?: boolean;
  className?: string;
  noMargin?: boolean;
}

const getMarginStyles = (
  isForDriver: boolean,
  isLanding: boolean,
  columns: number,
  sideMarginValue: number
): string => {
  if (typeof sideMarginValue !== 'number') {
    console.warn('sideMarginValue only accepts a number');
  }
  if (isForDriver) return `0 ${sideMarginValue}px ${theme.size.xlarge}`;
  else if (isLanding && columns !== 3) return `${theme.size.large} ${sideMarginValue}px`;
  else if (isLanding && columns === 3) return `${theme.size.medium} ${sideMarginValue}px ${theme.size.xlarge}`;
  else return `${theme.size.large} 0`;
};

const getColumnValue = (props: { columns?: number; children?: React.ReactNode }) =>
  props.columns || React.Children.count(props.children);

// Carousel styling refers to the horizontal scrolling display of the Cards;
// This is not a true carousel as it is not 'circular,' but is rather 1 row
// with n columns displaying only a subset on screen
const carouselStyling = ({ children }: { children?: React.ReactNode }) => css`
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

const verticalStyling = css`
  grid-column-gap: ${theme.size.default};
  grid-template-columns: 'auto';
  grid-row-gap: '${theme.size.default}';
`;

// StyledGrid behavior on medium and small screens is determined by 'isCarousel'
const StyledGrid = styled('div')<StyledGridProps>`
  align-items: stretch;
  display: grid;
  grid-column: 1 / -1 !important;
  grid-column-gap: ${theme.size.medium};
  grid-row-gap: ${theme.size.medium};
  grid-template-columns: ${(props) => `repeat(${getColumnValue(props)}, 1fr)`};

  margin: ${({ isForDrivers, isLanding, columns }) => getMarginStyles(Boolean(isForDrivers), isLanding, columns, 0)};

  @media ${theme.screenSize.upToMedium} {
    margin: ${({ isForDrivers, isLanding, columns }) => getMarginStyles(isForDrivers, isLanding, columns, 42)};
  }

  @media ${theme.screenSize.upToSmall} {
    margin: ${({ isForDrivers, isLanding, columns }) => getMarginStyles(isForDrivers, isLanding, columns, 24)};
  }

  ${
    '' /*want first 4 cards on landing page to stay as one column, and not affect group of 3 cards (so hacky i'm sorry) */
  }
  @media ${theme.screenSize.upToXLarge} {
    ${({ isLanding, columns }) => {
      if (isLanding) return `grid-template-columns: repeat(${columns}, 1fr);`;
      else return `grid-template-columns: repeat(2, 1fr);`;
    }}

  @media ${theme.screenSize.upToMedium} {
    ${({ isCarousel, ...props }) =>
      isCarousel
        ? carouselStyling(props)
        : `grid-template-columns: repeat(1, 1fr); grid-column-gap: ${theme.size.default};`}
  }

  ${'' /* If not isCarousel, stack Cards vertically in 1 column on small screens */}
  @media ${theme.screenSize.upToSmall} {
    ${({ isCarousel }) => !isCarousel && verticalStyling}
  }
`;

const CardGroup = ({
  className,
  nodeData: {
    children = [],
    options: { columns, layout, style, type },
  },
  page,
  ...rest
}: CardGroupProps) => {
  const isCompact = style === 'compact';
  const isExtraCompact = style === 'extra-compact';
  const isCarousel = layout === 'carousel';
  // Keep "type" for backwards compatibility, but it might be good to generalize to "style"
  const isCenterContentStyle = type === 'drivers' || style === 'center-content';
  const isLargeIconStyle = style === 'large-icon';
  const isDriversTemplate = page?.options?.template === 'drivers-index';
  const isLanding = page?.options?.template === 'landing';

  return (
    <StyledGrid
      className={['card-group', className].join(' ')}
      columns={columns}
      noMargin={true}
      isCarousel={isCarousel}
      isForDrivers={isDriversTemplate}
      isLanding={isLanding}
    >
      {children.map((child, i) => (
        <ComponentFactory
          {...rest}
          key={i}
          nodeData={child}
          isCompact={isCompact}
          isExtraCompact={isExtraCompact}
          isCenterContentStyle={isCenterContentStyle}
          isLargeIconStyle={isLargeIconStyle}
          page={page}
        />
      ))}
    </StyledGrid>
  );
};

export default CardGroup;
