import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@leafygreen-ui/emotion';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';
import Overline from './Internal/Overline';

const kickerBaseStyle = css`
  grid-column: 2;
  @media ${theme.screenSize.upToSmall} {
    padding-top: 56px;
  }
  @media ${theme.screenSize.upToXSmall} {
    padding-top: ${theme.size.large};
  }
`;

const Kicker = ({ nodeData: { argument }, ...rest }) => {
  return (
    <Overline className={kickerBaseStyle}>
      {argument.map((child, i) => (
        <ComponentFactory {...rest} nodeData={child} key={i} />
      ))}
    </Overline>
  );
};

Kicker.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Kicker;
