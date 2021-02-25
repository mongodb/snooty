import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { uiColors } from '@leafygreen-ui/palette';
import { Overline } from '@leafygreen-ui/typography';
import { getPlaintext } from '../../utils/get-plaintext';

const Kicker = ({ nodeData: { argument } }) => (
  <Overline
    css={css`
      color: ${uiColors.gray.dark1};
    `}
  >
    {getPlaintext(argument)}
  </Overline>
);

Kicker.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Kicker;
