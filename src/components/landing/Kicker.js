import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Overline } from '@leafygreen-ui/typography';
import { uiColors } from '@leafygreen-ui/palette';
import { useTheme } from 'emotion-theming';
import ComponentFactory from '../ComponentFactory';

const Kicker = ({ nodeData: { argument }, ...rest }) => {
  const { screenSize, fontSize, size } = useTheme();

  const StyledKicker = styled(Overline)`
    font-size: ${fontSize.small};
    color: ${uiColors.gray.dark1};
    padding-top: 80px;
    padding-bottom: ${size.small};
    @media ${screenSize.upToSmall} {
      padding-top: 56px;
    }
    @media ${screenSize.upToXSmall} {
      padding-top: ${size.large};
    }
  `;

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
