import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from '../../theme/docsTheme';
import VideoPlayButton from './VideoPlayButton';

const ReactPlayerWrapper = styled('div')`
  margin-bottom: ${theme.size.articleContent};
  position: relative;
  padding-top: 56.25%;
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
        url={argument[0]['refuri']}
        width="100%"
        height="100%"
        playing
        playIcon={<VideoPlayButton />}
        light={<VideoPlayButton />}
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
