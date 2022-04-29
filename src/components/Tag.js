import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../theme/docsTheme';

const baseStyle = css`
  align-items: center;
  border-radius: ${theme.size.tiny};
  display: inline-flex;
  padding: ${theme.size.tiny} ${theme.size.small};
`;

export const searchTagStyle = css`
  cursor: pointer;
  height: 26px;
  font-size: ${theme.fontSize.small};
  margin-right: ${theme.size.small};
`;

const VARIANTS = {
  blue: css`
    background-color: ${palette.blue.light3};
    border: 1px solid ${palette.blue.light2};
    color: ${palette.blue.dark1};
  `,
  green: css`
    background-color: ${palette.green.light3};
    border: 1px solid ${palette.green.light2};
    color: ${palette.green.dark2};
  `,
  purple: css`
    background-color: ${palette.purple.light3};
    border: 1px solid ${palette.purple.light2};
    color: ${palette.purple.dark2};
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
  variant: PropTypes.string,
};

export default Tag;
