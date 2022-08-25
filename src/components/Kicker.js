import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Overline } from '@leafygreen-ui/typography';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';

const StyledKicker = styled(Overline)`
  color: ${palette.gray.base};
  grid-column: 2;
  margin-top: 48px;
  margin-bottom: 0px;
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
