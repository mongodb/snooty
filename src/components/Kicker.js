import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Overline } from '@leafygreen-ui/typography';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';

const StyledKicker = styled(Overline)`
  grid-column: 1;
  font-size: ${theme.fontSize.small};
  color: ${uiColors.gray.dark1};
  padding-top: 80px;
  padding-bottom: ${theme.size.small};
  @media ${theme.screenSize.upToSmall} {
    padding-top: 56px;
  }
  @media ${theme.screenSize.upToXSmall} {
    padding-top: ${theme.size.large};
  }
`;

const Kicker = ({ nodeData: { argument }, ...rest }) => {
  return (
    <StyledKicker>
      {argument.map((child, i) => (
        <ComponentFactory {...rest} nodeData={child} key={i} />
      ))}
    </StyledKicker>
  );
};

Kicker.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Kicker;
