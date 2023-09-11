import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import { Body } from '@leafygreen-ui/typography';

const customStyleHeader = css`
  color: #061621;
  font-size: 24px;
  font-weight: 500;
  margin: 0;
`;

const SectionHeader = ({ children, customStyles, as }) => {
  return (
    <Body className={cx([customStyleHeader, customStyles])} as={as}>
      {children}
    </Body>
  );
};
SectionHeader.defaultProps = {
  as: 'h1',
};

SectionHeader.prototype = {
  as: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]).isRequired,
  customStyles: PropTypes.string,
};

export default SectionHeader;
