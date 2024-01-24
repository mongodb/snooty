import React, { useCallback, useRef } from 'react';
import { css } from '@emotion/react';
import IconButton from '@leafygreen-ui/icon-button';
import Icon from '@leafygreen-ui/icon';
import { theme } from '../../theme/docsTheme';
import LabDrawer from './LabDrawer';

const controlsStyle = css`
  width: 100%;
  height: 48px;
  background-color: rgb(28, 38, 57);
  margin-top: -10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 1rem;
  margin-bottom: ${theme.size.default};
`;

const Instruqt = ({ nodeData: { argument }, nodeData }) => {
  const embedValue = argument[0]?.value;
  const iframeRef = useRef(null);

  const onFullScreen = useCallback(() => {
    if (iframeRef) {
      const element = iframeRef.current;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    }
  }, [iframeRef]);

  if (!embedValue) {
    return null;
  }

  return (
    <>
      {process.env.GATSBY_FEATURE_LAB_DRAWER === 'true' ? (
        <>
          <LabDrawer embedValue={embedValue} />
        </>
      ) : (
        <>
          <iframe
            ref={iframeRef}
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
            title={`Instruqt ${embedValue}`}
            height="640"
            width="100%"
            src={`https://play.instruqt.com/embed${embedValue}`}
          />
          <div css={controlsStyle}>
            <IconButton aria-label="Full Screen" onClick={onFullScreen}>
              <Icon glyph="FullScreenEnter" />
            </IconButton>
          </div>
        </>
      )}
    </>
  );
};

export default Instruqt;
