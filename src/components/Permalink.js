import React from 'react';
import { withPrefix } from 'gatsby';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { cx, css as LeafyCSS } from '@leafygreen-ui/emotion';
import Tooltip from '@leafygreen-ui/tooltip';

const tooltipStyle = LeafyCSS` 
  padding: 2px 8px;
  font-size: 10px;

  > div {
    font-size: 12px;
  }
`;

const headingStyle = css`
  align-self: center;
  visibility: hidden;
  padding: 0 10px;
`;

const LinkIcon = styled.img`
  border-radius: 0 !important;
  display: initial !important;
  margin: initial !important;
`;

const Permalink = ({ copied, setHeadingNode, id, handleClick }) => (
  <>
    <a
      className="headerlink"
      ref={setHeadingNode}
      css={headingStyle}
      href={`#${id}`}
      title="Permalink to this definition"
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
  </>
);

export default Permalink;
