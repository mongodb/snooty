import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { Overline as LGOverline } from '@leafygreen-ui/typography';

const overlineBaseStyling = css`
  margin-top: 48px;
  margin-bottom: 0px;
  color: var(--font-color-light);
`;

const Overline = ({ className, children }) => {
  return <LGOverline className={cx(overlineBaseStyling, className)}>{children}</LGOverline>;
};

Overline.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Overline;
