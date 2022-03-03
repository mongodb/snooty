import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { cx, css as LeafyCSS } from '@leafygreen-ui/emotion';
import Tooltip from '@leafygreen-ui/tooltip';
import { isBrowser } from '../utils/is-browser';
import { theme } from '../theme/docsTheme';
import useCopyClipboard from '../hooks/useCopyClipboard';

const tooltipStyle = LeafyCSS` 
  padding: 2px 8px;
  font-size: ${theme.fontSize.xsmall};

  > div {
    font-size: ${theme.fontSize.tiny};
  }
`;

const LinkIcon = styled.img`
  border-radius: 0 !important;
  display: initial !important;
  margin: initial !important;
`;

const HeaderBuffer = styled.div`
  margin-top: ${({ bufferSpace }) => bufferSpace};
  position: absolute;
  // Add a bit of padding to help headings be more accurately set as "active" on FF and Safari
  padding-bottom: 2px;
`;

const headingStyle = (copied) => css`
  ${!!copied && 'visibility: visible !important;'}
  align-self: center;
  padding: 0 10px;
`;

const Permalink = ({ id, description, buffer }) => {
  const [copied, setCopied] = useState(false);
  const [headingNode, setHeadingNode] = useState(null);
  const url = isBrowser ? window.location.href.split('#')[0] + '#' + id : '';
  const bufferSpace = buffer || '-175px';

  useCopyClipboard(copied, setCopied, headingNode, url);

  const handleClick = (e) => {
    setCopied(true);
  };

  return (
    <>
      <a
        className="headerlink"
        ref={setHeadingNode}
        css={headingStyle(copied)}
        href={`#${id}`}
        title={'Permalink to this ' + description}
        onClick={handleClick}
      >
        <LinkIcon src={withPrefix('assets/link.svg')} />
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
      </a>
      <HeaderBuffer id={id} bufferSpace={bufferSpace} />
    </>
  );
};

Permalink.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buffer: PropTypes.string,
};

export default Permalink;
