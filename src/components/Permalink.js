import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { cx, css } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import Tooltip from '@leafygreen-ui/tooltip';
import { isBrowser } from '../utils/is-browser';
import { theme } from '../theme/docsTheme';
import useCopyClipboard from '../hooks/useCopyClipboard';
import useHashAnchor from '../hooks/use-hash-anchor';
import { usePageContext } from '../context/page-context';

const tooltipStyle = css`
  padding: 2px 8px;
  font-size: ${theme.fontSize.xsmall};

  > div {
    font-size: ${theme.fontSize.tiny};
  }
`;

const HeaderBuffer = styled.div(
  (props) => `
  display: inline;
  left: 0;
  top: 0;
  margin-top: ${
    props.hasComposable
      ? `calc(-1 * (${theme.header.composableDesktopHeight} + ${theme.header.navbarScrollOffset}))`
      : `-${theme.header.navbarScrollOffset}`
  };
  position: absolute;
  // Add a bit of padding to help headings be more accurately set as "active" on FF and Safari
  padding-bottom: 2px;

  @media ${theme.screenSize.upToMedium} {
    margin-top: ${
      props.hasComposable
        ? `calc(-1 * (${theme.header.composableMobileHeight} + ${theme.header.navbarScrollOffset}))`
        : `-${theme.header.navbarScrollOffset}`
    }
  }
`
);

const headingStyle = (copied) => css`
  ${!!copied && 'visibility: visible !important;'}
  position: absolute;
  align-self: center;
  padding: 0 10px;
  visibility: hidden;
`;

const iconStyling = css`
  vertical-align: middle;
  margin-top: -2px;
`;

const Permalink = ({ id, description }) => {
  const [copied, setCopied] = useState(false);
  const [headingNode, setHeadingNode] = useState(null);
  const { darkMode } = useDarkMode();
  const url = isBrowser ? window.location.href.split('#')[0] + '#' + id : '';

  useCopyClipboard(copied, setCopied, headingNode, url);

  const { options } = usePageContext();

  const handleClick = (e) => {
    setCopied(true);
  };

  const linkRef = useRef();
  useHashAnchor(id, linkRef);

  return (
    <a
      className={cx('headerlink', headingStyle(copied))}
      ref={setHeadingNode}
      href={`#${id}`}
      title={'Permalink to this ' + description}
      onClick={handleClick}
    >
      <Icon
        className={cx(iconStyling)}
        glyph={'Link'}
        size={12}
        fill={darkMode ? palette.gray.light1 : palette.gray.base}
      />
      <Tooltip
        className={cx(tooltipStyle)}
        triggerEvent="click"
        open={copied}
        align="top"
        justify="middle"
        darkMode={true}
      >
        {'copied'}
      </Tooltip>
      <HeaderBuffer hasComposable={options?.has_composable_tutorial ?? false} ref={linkRef} id={id} />
    </a>
  );
};

Permalink.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Permalink;
