import React from 'react';
import PropTypes from 'prop-types';
import { cx } from '@leafygreen-ui/emotion';
import { H3 } from '@leafygreen-ui/typography';

const SectionHeader = ({ children, customStyles }) => {
  return <H3 className={cx(customStyles)}>{children}</H3>;
};

SectionHeader.prototype = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]).isRequired,
  customStyles: PropTypes.string,
};

export default SectionHeader;
