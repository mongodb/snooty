import React from 'react';
import PropTypes from 'prop-types';
import { uiColors } from '@leafygreen-ui/palette';

const Tag = ({ text }) => (
  <span
    css={theme => ({
      backgroundColor: uiColors.green.light3,
      borderRadius: 4,
      color: uiColors.green.base,
      fontWeight: 'bold',
      padding: `${theme.size.tiny} ${theme.size.small}`,
    })}
  >
    {text}
  </span>
);

Tag.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Tag;
