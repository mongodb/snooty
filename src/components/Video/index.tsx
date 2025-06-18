import React, { useState, useEffect, useMemo } from 'react';
import ReactPlayerYT from 'react-player/youtube';
import ReactPlayerWistia from 'react-player/wistia';
import styled from '@emotion/styled';
import { css } from '@leafygreen-ui/emotion';
import { palette } from '@leafygreen-ui/palette';
import { withPrefix } from 'gatsby';
import { theme } from '../../theme/docsTheme';
import { STRUCTURED_DATA_CLASSNAME, VideoObjectSd } from '../../utils/structured-data';
import type { VideoNode } from '../../types/ast';
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

const videoStyling = ({ name }: { name: string }) => css`
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

const getTheSupportedMedia = (url: string) => {
  let supportedType: 'yt' | 'wistia' | null = null;

  if (url.includes('youtube') || url.includes('youtu.be')) {
    supportedType = 'yt';
  }

  if (url.includes('wistia')) {
    supportedType = 'wistia';
  }

  return REACT_PLAYERS[supportedType as keyof typeof REACT_PLAYERS];
};

interface VideoProps {
  nodeData: VideoNode;
}

const Video = ({ nodeData: { argument, options } }: VideoProps) => {
  const url = `${argument[0]['refuri']}`;
  // use placeholder image for video thumbnail if invalid URL provided
  const [previewImage, setPreviewImage] = useState<string | boolean>(withPrefix('assets/meta_generic.png'));
  const { title, description, 'upload-date': uploadDate, 'thumbnail-url': thumbnailUrl } = options || {};
  const videoObjectSd = useMemo(() => {
    const sd = new VideoObjectSd({ embedUrl: url, name: title, uploadDate, thumbnailUrl, description });
    return sd.isValid() ? sd.toString() : undefined;
  }, [url, title, uploadDate, thumbnailUrl, description]);

  // handles URL validity checking for well-formed YT links
  const checkUrlValidity = async (url: string) => {
    if (url.includes('youtube') || url.includes('youtu.be')) {
      let testUrlValidity = 'https://www.youtube.com/oembed?url=' + url + '&format=json';

      const res = await fetch(testUrlValidity);
      if (res?.ok) {
        setPreviewImage(true);
      }
    }
  };

  useEffect(() => {
    checkUrlValidity(url);
  }, [url]);

  const ReactSupportedMedia = getTheSupportedMedia(url);

  if (!ReactSupportedMedia) {
    console.warn(`Media Not Found: A video player could not be found for the following ${url}`);
    return null;
  }

  const ReactPlayer = ReactSupportedMedia.player as any;
  const playable = (ReactPlayer as unknown as typeof ReactPlayer).canPlay?.(url);

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
          dangerouslySetInnerHTML={{ __html: videoObjectSd }}
        />
      )}
      <ReactPlayerWrapper>
        <ReactPlayer
          className={videoStyling(ReactSupportedMedia)}
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

export default Video;
