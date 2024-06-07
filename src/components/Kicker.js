import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { Overline } from '@leafygreen-ui/typography';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';
import ComponentFactory from './ComponentFactory';

const kickerBaseStyling = css`
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

const kickerLightStyling = css`
  color: ${palette.gray.base};
  ${kickerBaseStyling}
`;

const Kicker = ({ nodeData: { argument }, ...rest }) => {
  const { darkMode } = useDarkMode();
  return (
    <Overline className={cx({ [kickerBaseStyling]: darkMode === true }, { [kickerLightStyling]: darkMode === false })}>
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
