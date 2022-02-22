import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { uiColors } from '@leafygreen-ui/palette';
import LeafyButton from '@leafygreen-ui/button';
import PlayIcon from '@leafygreen-ui/icon/dist/Play';

const StyledButton = styled(LeafyButton)`
  color: ${uiColors.white};
  background-color: #0c1c27;
  border: 1px solid ${uiColors.gray.light3};
  border-radius: 50% !important;
  height: 80px;
  width: 80px;
  &:hover,
  &:active {
    border: none !important;
    box-shadow: none !important;
  }
`;

// Handles concentric circles on hover
const playButtonBorderStyling = css`
  border: 8px solid transparent;
  border-radius: 50% !important;
  box-shadow: 0px 0px 0px 8px transparent;
  :hover {
    background-color: ${uiColors.gray.light1 + 'AA'};
    box-shadow: 0px 0px 0px 8px ${uiColors.gray.dark2 + '80'};
    transition: box-shadow 0.6s, background-color 0.6s;
  }
`;

const VideoPlayButton = () => {
  return (
    <div css={playButtonBorderStyling}>
      <StyledButton>
        <PlayIcon size="xlarge" />
      </StyledButton>
    </div>
  );
};

export default VideoPlayButton;
