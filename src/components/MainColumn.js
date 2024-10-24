import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { theme } from '../theme/docsTheme';

const MainColumn = ({ children, className }) => (
  <main
    className={className}
    css={css`
      margin: ${theme.size.default} ${theme.size.xlarge} ${theme.size.xlarge};
      max-width: 800px;
      min-height: 600px;

      @media ${theme.screenSize.upToXSmall} {
        margin: ${theme.size.default} ${theme.size.medium} ${theme.size.xlarge};
      }

      @media ${theme.screenSize.upToSmall} {
        margin: ${theme.size.default} ${theme.size.large} ${theme.size.xlarge};
      }

      @media ${theme.screenSize.upToLarge} {
        margin: ${theme.size.default} 48px ${theme.size.xlarge};
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
