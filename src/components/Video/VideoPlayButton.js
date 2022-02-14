import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../../theme/docsTheme.js';
import LeafyButton from '@leafygreen-ui/button';
import PlayIcon from '@leafygreen-ui/icon/dist/Play';

const playStyles = (theme) => css`
  background-color: #0c1c27;
  border: 1px solid #f9fbfa;
  border-radius: 50% !important;
  height: 80px;
  width: 80px;
  padding: ${theme.size.default};
  position: relative;

  :hover {
    background-color: #f9fbfa;
    border-color: #f9fbfa;
    color: #000000;
    transition: color 0.4s;
  }
`;

const StyledButton = styled(LeafyButton)`
  margin: -1px;
  &:hover,
  &:active {
    border: none !important;
    box-shadow: none !important;
  }
  border-radius: 50% !important;
  display: inline-block;
  padding: ${theme.size.default};
  position: relative;
  color: #f9fbfa;

  ${({ play, theme }) => play && playStyles(theme)}
`;

const playButtonBorderStyling = css`
  border: 8px solid transparent;
  border-radius: 50% !important;
  outline: 8px solid transparent;
  :hover {
    border: 8px solid rgba(159, 161, 162, 0.6);
    transition: border 0.6s;
    outline: 8px solid rgba(61, 79, 88, 0.6);
    transition: outline 0.2s;
  }
`;

const VideoPlayButton = ({ children, href, play, to, hasArrow = true, ...props }) => {
  return (
    <div css={playButtonBorderStyling}>
      <StyledButton play={play} {...props}>
        <PlayIcon size="xlarge" />
      </StyledButton>
    </div>
  );
};

export default VideoPlayButton;
