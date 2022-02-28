import React, { useState } from 'react';
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
  // if valid YT video, use default thumbnail. Otherwise, use a placeholder image
  const [previewImage, setPreviewImage] = useState(withPrefix('assets/meta_generic.png'));

  if (!playable) {
    console.warn(`Invalid URL: ${url} has been passed into the Video component`);
    return null;
  }

  // get video ID for youtube videos to check validity
  if (url.includes('youtube') || url.includes('youtu.be')) {
    let videoId = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if (videoId == null) {
      console.warn(`Invalid URL: ${url} has been passed into the Video component`);
      return null;
    }
    videoId = videoId?.[1];
    // check for timestamps
    videoId = videoId.split('?t=');
    videoId = videoId[0];

    // check if the YT video id is valid
    let img = new Image();
    img.src = 'http://img.youtube.com/vi/' + videoId + '/mqdefault.jpg';
    img.onload = function () {
      // an mq thumbnail has width 320, but if video does not exist, a default thumbnail width of 120 is returned
      if (this.width !== 120) {
        setPreviewImage(true);
      }
    };
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
