import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { css, cx } from '@leafygreen-ui/emotion';
import { GuideCue } from '@leafygreen-ui/guide-cue';
import { palette } from '@leafygreen-ui/palette';
import { Body } from '@leafygreen-ui/typography';

import { useClickOutside } from '../../hooks/use-click-outside';
import useScreenSize from '../../hooks/useScreenSize';
import CloseButton from '../Widgets/FeedbackWidget/components/CloseButton';

const DARK_MODE_ANNOUNCED = 'dark-mode-announced';

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

const videoStyles = css`
  border-radius: 12px;
  max-width: 244px;
  width: 244px;
`;

const GuideCueFooter = styled.div`
  padding: 24px 24px 16px;
`;

const DarkModeGuideCue = ({ darkRef }) => {
  const ref = useRef();
  const { isMobile } = useScreenSize();
  const { darkMode } = useDarkMode();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isMobile || !localStorage) return;
    // Maybe need to check if window is defined
    const darkModeAnnounced = localStorage.getItem(DARK_MODE_ANNOUNCED);
    if (darkModeAnnounced !== 'true') setIsOpen(true);
  }, [isMobile]);

  const onClose = () => {
    setIsOpen(false);
    localStorage.setItem(DARK_MODE_ANNOUNCED, 'true');
  };

  useClickOutside(ref, onClose);

  const stagingUrl = 'https://mongodbcom-cdn.website.staging.corp.mongodb.com/docs-qa/assets/darkModeGuideCue.mov';
  const prodUrl = 'http://www.mongodb.com/docs/assets/darkModeGuideCue.mov';
  console.log(prodUrl);

  if (!isOpen) return <></>;

  return (
    <GuideCue
      open={isOpen}
      tooltipAlign="bottom"
      tooltipJustify="start"
      setOpen={setIsOpen}
      refEl={darkRef}
      numberOfSteps={1}
      currentStep={1}
      popoverZIndex={20000}
      darkMode={darkMode}
      portalRef={ref}
      portalClassName={cx(css`
        #guide-cue-label {
          display: none;
        }

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
            <video autoPlay muted className={cx(videoStyles)}>
              <source src={stagingUrl} type="video/mp4"></source>
            </video>
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
