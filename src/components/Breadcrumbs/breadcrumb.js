import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { css as LeafyCss, cx } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../theme/docsTheme';
import Link from '../Link';

const activeColor = css`
  color: ${palette.gray.dark3};
`;

const linkStyling = LeafyCss`
  font-size: ${theme.fontSize.small};
  :last-of-type {
    ${activeColor}
  }

  :hover,
  :focus {
    text-decoration: none;

    :not(:last-of-type) {
      ${activeColor}
    }
  }
`;

const Breadcrumb = ({ url, title, onClick }) => {
  return (
    <>
      <Link className={cx(linkStyling)} to={url} onClick={onClick}>
        {title}
      </Link>
    </>
  );
};

Breadcrumb.prototype = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Breadcrumb;
