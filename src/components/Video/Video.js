import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
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
  // use placeholder image for video thumbnail if invalid URL provided
  const [previewImage, setPreviewImage] = useState(withPrefix('assets/meta_generic.png'));

  useEffect(() => {
    // handles URL validity checking for well-formed YT links
    if (url.includes('youtube') || url.includes('youtu.be')) {
      const https = require('https');
      let testUrlValidity = 'https://www.youtube.com/oembed?url=' + url + '&format=json';

      https.get(testUrlValidity, (res) => {
        // if valid URL, display default YT thumbnail
        if (res.statusCode === 200) {
          setPreviewImage(true);
        }
      });
    }
  }, [url]);

  // handles remaining cases for invalid video URLs
  if (!playable) {
    console.warn(`Invalid URL: ${url} has been passed into the Video component`);
    return null;
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
