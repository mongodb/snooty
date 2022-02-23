import React from 'react';
import ReactPlayer from 'react-player/youtube';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
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
  const playable = ReactPlayer.canPlay(argument[0]['refuri']);

  if (!playable) {
    console.warn(`Invalid URL: ${argument[0]['refuri']} has been passed into the Video component`);
    return null;
  }

  return (
    <>
      {playable && (
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
            url={argument[0]['refuri']}
            width="100%"
            height="100%"
            playing
            playIcon={<VideoPlayButton />}
            light={<VideoPlayButton />}
          />
        </ReactPlayerWrapper>
      )}
    </>
  );
};

Video.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.array.isRequired,
  }).isRequired,
};

export default Video;
