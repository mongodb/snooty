import React, { useCallback, useRef, useContext } from 'react';
import { css } from '@emotion/react';
import IconButton from '@leafygreen-ui/icon-button';
import Icon from '@leafygreen-ui/icon';
import { theme } from '../../theme/docsTheme';
import LabDrawer from './LabDrawer';
import InstruqtFrame from './InstruqtFrame';
import { InstruqtContext } from './instruqt-context';

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

const Instruqt = ({ nodeData }) => {
  const embedValue = nodeData?.argument[0]?.value;
  const title = nodeData?.options?.title;
  const iframeRef = useRef(null);
  const { isOpen } = useContext(InstruqtContext);

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
        <>{isOpen && <LabDrawer embedValue={embedValue} title={title} />}</>
      ) : (
        <>
          <InstruqtFrame title={title} embedValue={embedValue} ref={iframeRef} />
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
