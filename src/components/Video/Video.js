import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { withPrefix } from 'gatsby';
import { theme } from '../../theme/docsTheme';
import VideoPlayButton from './VideoPlayButton';

const ReactPlayerWrapper = styled('div')`
  position: relative;
  padding-top: 56.25%;
  margin: ${theme.size.medium} 0px;
`;

const StyledReactPlayer = styled(ReactPlayer)`
  position: absolute;
  top: 0;
  left: 0;
  > div {
    /* Redefines stacking context, allowing play button animation to stick on top */
    position: sticky;
  }
`;

const videoStyling = css`
  * {
    border-radius: 16px !important;
  }
`;

const Video = ({ nodeData: { argument }, ...rest }) => {
  const url = `${argument[0]['refuri']}`;
  const playable = ReactPlayer.canPlay(url);

  if (!playable) {
    console.warn(`Invalid URL: ${url} has been passed into the Video component`);
    return null;
  }

  // if YT video, use default thumbnail. Otherwise, use a placeholder image
  let previewImage = withPrefix('assets/meta_generic.png');

  if (url.includes('youtube') || url.includes('youtu.be')) {
    previewImage = true;
  }

  return (
    <ReactPlayerWrapper>
      <StyledReactPlayer
        css={videoStyling}
        config={{
          youtube: {
            playerVars: {
              autohide: 1,
              modestbranding: 1,
              rel: 0,
            },
          },
        }}
        controls
        url={url}
        width="100%"
        height="100%"
        playing
        playIcon={<VideoPlayButton />}
        light={previewImage}
      />
    </ReactPlayerWrapper>
  );
};

Video.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.array.isRequired,
  }).isRequired,
};

export default Video;
