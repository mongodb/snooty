import React, { useState, useEffect, useMemo } from 'react';
import ReactPlayerYT from 'react-player/youtube';
import ReactPlayerWistia from 'react-player/wistia';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { palette } from '@leafygreen-ui/palette';
import { withPrefix } from 'gatsby';
import { theme } from '../../theme/docsTheme';
import { STRUCTURED_DATA_CLASSNAME, VideoObjectSd } from '../../utils/structured-data';
import VideoPlayButton from './VideoPlayButton';

// Imported both players to keep bundle size low and rendering the one associated to the URL being passed in
const REACT_PLAYERS = {
  yt: {
    player: ReactPlayerYT,
    config: {
      youtube: {
        playerVars: {
          autohide: 1,
          modestbranding: 1,
          rel: 0,
        },
      },
    },
    name: 'youtube',
  },
  wistia: {
    player: ReactPlayerWistia,
    config: {},
    name: 'wistia',
  },
};

const ReactPlayerWrapper = styled('div')`
  position: relative;
  padding-top: 56.25%;
  margin: ${theme.size.medium} 0px;
  border-radius: 16px;
  overflow: hidden;
`;

const videoStyling = ({ name }) => css`
  position: absolute;
  top: 0;
  left: 0;
  > div {
    /* Redefines stacking context, allowing play button animation to stick on top */
    position: sticky;
  }

  ${name === 'wistia' &&
  `video {
    background: ${palette.white} !important
  }`}
`;

const getTheSupportedMedia = (url) => {
  let supportedType = null;

  if (url.includes('youtube') || url.includes('youtu.be')) {
    supportedType = 'yt';
  }

  if (url.includes('wistia')) {
    supportedType = 'wistia';
  }

  return REACT_PLAYERS[supportedType];
};

const Video = ({ nodeData: { argument, options = {} } }) => {
  const url = `${argument[0]['refuri']}`;
  // use placeholder image for video thumbnail if invalid URL provided
  const [previewImage, setPreviewImage] = useState(withPrefix('assets/meta_generic.png'));
  const { title, description, 'upload-date': uploadDate, 'thumbnail-url': thumbnailUrl } = options;
  const videoObjectSd = useMemo(() => {
    const sd = new VideoObjectSd({ embedUrl: url, name: title, uploadDate, thumbnailUrl, description });
    return sd.isValid() ? sd.toString() : undefined;
  }, [url, title, uploadDate, thumbnailUrl, description]);

  useEffect(() => {
    // handles URL validity checking for well-formed YT links
    if (url.includes('youtube') || url.includes('youtu.be')) {
      let testUrlValidity = 'https://www.youtube.com/oembed?url=' + url + '&format=json';

      fetch(testUrlValidity, (res) => {
        // if valid URL, display default YT thumbnail
        if (res.statusCode === 200) {
          setPreviewImage(true);
        }
      });
    }
  }, [url]);

  const ReactSupportedMedia = getTheSupportedMedia(url);

  if (!ReactSupportedMedia) {
    console.warn(`Media Not Found: A video player could not be found for the following ${url}`);
    return null;
  }

  const ReactPlayer = ReactSupportedMedia.player;
  const playable = ReactPlayer.canPlay(url);

  // handles remaining cases for invalid video URLs
  if (!playable) {
    console.warn(`Invalid URL: ${url} has been passed into the Video component`);
    return null;
  }

  return (
    <>
      {videoObjectSd && (
        <script
          className={STRUCTURED_DATA_CLASSNAME}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: videoObjectSd,
          }}
        />
      )}
      <ReactPlayerWrapper>
        <ReactPlayer
          css={videoStyling(ReactSupportedMedia)}
          config={ReactSupportedMedia.config}
          controls
          url={url}
          width="100%"
          height="100%"
          playing
          playIcon={<VideoPlayButton />}
          light={previewImage}
        />
      </ReactPlayerWrapper>
    </>
  );
};

Video.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.array.isRequired,
    options: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      'upload-date': PropTypes.string,
      'thumbnail-url': PropTypes.string,
    }),
  }).isRequired,
};

export default Video;
