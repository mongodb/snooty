import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { uiColors } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';

const baseStyle = css`
  align-items: center;
  border-radius: ${theme.size.tiny};
  display: inline-flex;
  padding: ${theme.size.tiny} ${theme.size.small};
`;

const VARIANTS = {
  blue: css`
    background-color: ${uiColors.blue.light3};
    border: 1px solid ${uiColors.blue.light2};
    // TODO: Update this to be blue.dark1 when we upgrade our Palette
    color: ${uiColors.blue.dark2};
  `,
  green: css`
    background-color: ${uiColors.green.light3};
    border: 1px solid ${uiColors.green.light2};
    color: ${uiColors.green.dark2};
  `,
};

const Tag = ({ children, variant, ...rest }) => {
  const variantStyle = VARIANTS[variant] || VARIANTS['green'];

  return (
    <span css={[baseStyle, variantStyle]} {...rest}>
      {children}
    </span>
  );
};

Tag.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Tag;
