import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { Overline as LGOverline } from '@leafygreen-ui/typography';
import { palette } from '@leafygreen-ui/palette';

const overlineBaseStyling = css`
  margin-top: 48px;
  margin-bottom: 0px;
  color: var(--font-color-light);
`;

const overlineLightStyling = css`
  color: ${palette.gray.base};
  ${overlineBaseStyling}
`;

const Overline = ({ className, children }) => {
  const { darkMode } = useDarkMode();
  return (
    <LGOverline className={cx(darkMode ? overlineBaseStyling : overlineLightStyling, className)}>{children}</LGOverline>
  );
};

Overline.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Overline;
