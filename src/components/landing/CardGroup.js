import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';
import { theme } from '../../theme/docsTheme';

const getColumnValue = props => props.columns || React.Children.count(props.children);

// TODO: StyledGrid should make use of the 'columns' option when specified
const StyledGrid = styled('div')`
  align-items: stretch;
  display: grid;
  grid-column: 1 / -1 !important;
  grid-column-gap: ${theme.size.medium};
  grid-row-gap: ${theme.size.medium};
  grid-template-columns: ${props => `repeat(${getColumnValue(props)}, 1fr)`};
  margin: ${theme.size.large} 0;

  @media ${theme.screenSize.upToLarge} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${theme.screenSize.upToMedium} {
    grid-gap: ${`calc(${theme.size.medium} * 0.75)`};
    grid-template-columns: ${({ children }) => `calc(${theme.size.medium} / 2)
       repeat(${React.Children.count(children)}, calc(75% - (2 * ${theme.size.medium})))
       calc(${theme.size.medium} / 2)`};
    grid-template-rows: minmax(150px, 1fr);
    margin: ${theme.size.medium} 0;
    overflow-x: scroll;
    padding-bottom: ${`calc(${theme.size.medium} / 2)`};
    scroll-snap-type: x proximity;

    &:before,
    &:after {
      content: '';
    }
  }

  ${'' /* If isCompact, stack Cards vertically on small screens */}
  @media ${theme.screenSize.upToSmall} {
    grid-template-columns: ${({ isCompact }) => isCompact && `auto`};
    &:before {
      content: ${({ isCompact }) => isCompact && `unset`};
    }
  }
`;

const CardGroup = ({
  nodeData: {
    children,
    options: { columns, style },
  },
  page,
  ...rest
}) => {
  const isCompact = style === 'compact';
  return (
    <StyledGrid columns={columns} isCompact={isCompact}>
      {children.map(child => (
        <ComponentFactory nodeData={child} style={style} {...rest} />
      ))}
    </StyledGrid>
  );
};

CardGroup.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.shape({
      columns: PropTypes.number,
    }),
  }).isRequired,
};

export default CardGroup;
