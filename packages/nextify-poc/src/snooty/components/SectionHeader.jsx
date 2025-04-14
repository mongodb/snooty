import React from 'react';
import PropTypes from 'prop-types';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import { cx } from '@leafygreen-ui/emotion';
import { H3 } from '@leafygreen-ui/typography';

const SectionHeader = ({ children, customStyles }) => {
  const { darkMode } = useDarkMode();
  return (
    <H3 as="h2" className={cx(customStyles)} style={{ color: darkMode ? palette.gray.light2 : palette.black }}>
      {children}
    </H3>
  );
};

SectionHeader.prototype = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]).isRequired,
  customStyles: PropTypes.string,
};

export default SectionHeader;
