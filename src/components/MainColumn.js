import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { theme } from '../theme/docsTheme';

export const MAIN_COLUMN_HORIZONTAL_MARGIN = theme.size.xlarge;

const MainColumn = ({ children, className }) => (
  <main
    className={className}
    css={css`
      margin: ${theme.size.default} ${MAIN_COLUMN_HORIZONTAL_MARGIN} ${theme.size.xlarge};
      max-width: 800px;
      min-height: 600px;

      @media ${theme.screenSize.upToLarge} {
        margin: ${theme.size.default} 48px ${theme.size.xlarge};
      }

      @media ${theme.screenSize.upToSmall} {
        margin: ${theme.size.default} ${theme.size.medium} ${theme.size.xlarge};
      }
    `}
  >
    {children}
  </main>
);

MainColumn.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default MainColumn;
