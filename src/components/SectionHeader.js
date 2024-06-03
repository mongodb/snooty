import React from 'react';
import PropTypes from 'prop-types';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import { css } from '@leafygreen-ui/emotion';
import { cx } from '@leafygreen-ui/emotion';
import { H3 } from '@leafygreen-ui/typography';

const baseStyles = (darkMode) => css`
  color: ${({ darkMode }) => (darkMode ? palette.gray.light2 : palette.black)};
`;

const SectionHeader = ({ children, customStyles }) => {
  const { darkMode } = useDarkMode();
  return (
    <H3 as="h2" className={cx(baseStyles(darkMode), customStyles)}>
      {children}
    </H3>
  );
};

SectionHeader.prototype = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]).isRequired,
  customStyles: PropTypes.string,
};

export default SectionHeader;
