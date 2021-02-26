import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';
import { css } from '@emotion/core';
import { uiColors } from '@leafygreen-ui/palette';
import { Overline } from '@leafygreen-ui/typography';

const Kicker = ({ nodeData: { children }, ...rest }) => (
  <Overline
    css={css`
      color: ${uiColors.gray.dark1};
    `}
  >
    {children.map((child, i) => (
      <ComponentFactory {...rest} nodeData={child} key={i} />
    ))}
  </Overline>
);

Kicker.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Kicker;
