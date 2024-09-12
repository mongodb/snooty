import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { css, cx } from '@leafygreen-ui/emotion';
import { GuideCue } from '@leafygreen-ui/guide-cue';
import { palette } from '@leafygreen-ui/palette';
import { Body } from '@leafygreen-ui/typography';

import { withPrefix } from 'gatsby';
import { useClickOutside } from '../../hooks/use-click-outside';
import useScreenSize from '../../hooks/useScreenSize';
import CloseButton from '../Widgets/FeedbackWidget/components/CloseButton';

export const DARK_MODE_ANNOUNCED = 'dark-mode-announced';
const VIDEO_PATH = 'assets/darkModeGuideCue.mov';

const GuideCueContent = styled.div`
  min-width: 359px;

  h3 {
    font-size: 18px;
    line-height: 24px;
    color: ${palette.black};
    margin: 0 0 16px;
  }

  p {
    font-size: 13px;
    line-height: 20px;
    color: ${palette.black};
  }
`;

const GuideCueHeader = styled.div`
  background-color: ${palette.purple.light3};
  border-radius: 16px 16px 0 0;
  padding: 24px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoContainer = styled.div`
  width: 242px;
  overflow: hidden;
  display: flex;
  justify-content: center;
`;

const Video = styled.video`
  border-radius: 12px;
  // This width is two pixels larger than container to cut off black border :/ hence the overflow hidden and flex of the container
  max-width: 244px;
  width: 244px;
`;

const GuideCueFooter = styled.div`
  padding: 24px 24px 16px;
`;

const DarkModeGuideCue = ({ guideCueRef }) => {
  const ref = useRef();
  const { isMobile } = useScreenSize();
  const { darkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  useClickOutside(ref, onClose);

  // Use localStorage to only show once to each user
  useEffect(() => {
    if (!localStorage) return;
    const darkModeAnnounced = localStorage.getItem(DARK_MODE_ANNOUNCED);
    if (darkModeAnnounced !== 'true') setIsOpen(true);
    localStorage.setItem(DARK_MODE_ANNOUNCED, 'true');
  }, []);

  if (isMobile) return null;

  return (
    <GuideCue
      open={isOpen}
      tooltipAlign="bottom"
      tooltipJustify="start"
      setOpen={setIsOpen}
      refEl={guideCueRef}
      numberOfSteps={1}
      currentStep={1}
      popoverZIndex={20000}
      darkMode={darkMode}
      portalRef={ref}
      portalClassName={cx(css`
        // Hide title label (ghost margin)
        #guide-cue-label {
          display: none;
        }

        // Hide Footer with button (no way with LG to hide)
        div[role='dialog'] > div > div > div:last-child {
          display: none;
        }
      `)}
      tooltipClassName={cx(css`
        min-width: 359px;
        padding: 0;
        background-color: ${palette.white};

        svg {
          fill: ${palette.purple.light3};
        }
      `)}
      spacing={10}
    >
      <GuideCueContent>
        <GuideCueHeader>
          <CloseButton
            onClick={onClose}
            className={cx(css`
              color: ${palette.gray.base};
              &:hover {
                color: ${palette.black};
              }
              &:hover::before {
                background-color: rgba(61, 79, 88, 0.1);
              }
            `)}
          />
          <VideoContainer>
            <Video autoPlay muted>
              <source src={withPrefix(VIDEO_PATH)} type="video/mp4"></source>
            </Video>
          </VideoContainer>
        </GuideCueHeader>
        <GuideCueFooter>
          <h3>Announcing: Dark Mode 🌙</h3>
          <Body>Choose between dark mode, light mode or system theme to match your reading preferences</Body>
        </GuideCueFooter>
      </GuideCueContent>
    </GuideCue>
  );
};

export default DarkModeGuideCue;
