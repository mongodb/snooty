import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { css, cx } from '@leafygreen-ui/emotion';
import { GuideCue } from '@leafygreen-ui/guide-cue';
import { palette } from '@leafygreen-ui/palette';
import { Body, H3 } from '@leafygreen-ui/typography';

import { withPrefix } from 'gatsby';
import { useClickOutside } from '../../hooks/use-click-outside';
import useScreenSize from '../../hooks/useScreenSize';
import CloseButton from '../Widgets/FeedbackWidget/components/CloseButton';
import { getLocalValue, setLocalValue } from '../../utils/browser-storage';
import { theme } from '../../theme/docsTheme';

export const DARK_MODE_ANNOUNCED = 'dark-mode-announced';
const VIDEO_PATH = 'assets/darkModeGuideCue.mov';

const GuideCueContent = styled.div`
  min-width: 360px;

  h3 {
    font-size: ${theme.fontSize.h3};
    line-height: ${theme.size.medium};
    color: ${palette.black};
    margin: 0 0 ${theme.size.small};
  }

  p {
    font-size: ${theme.fontSize.small};
    line-height: 20px;
    color: ${palette.black};
  }
`;

const GuideCueHeader = styled.div`
  background-color: ${palette.purple.light3};
  border-radius: ${theme.size.small} ${theme.size.small} 0 0;
  padding: ${theme.size.medium} ${theme.size.small};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FocusTrapInvisibleButton = styled.button`
  border: none;
  outline: none;
  width: 0;
  height: 0;
  padding: 0;
  margin: 0;
  position: absolute;
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
  width: 244px;
`;

const GuideCueFooter = styled.div`
  padding: ${theme.size.medium} ${theme.size.medium} ${theme.size.small};
`;

const DarkModeGuideCue = ({ guideCueRef, dropdownIsOpen }) => {
  const ref = useRef();
  const { isMobile } = useScreenSize();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  useClickOutside(ref, onClose);

  // Use localStorage to only show only once to each user
  useEffect(() => {
    if (isMobile) return;
    const darkModeAnnounced = getLocalValue(DARK_MODE_ANNOUNCED);
    if (!darkModeAnnounced) setIsOpen(true);
    setLocalValue(DARK_MODE_ANNOUNCED, true);
  }, [isMobile]);

  // Close GuideCue if dark mode dropdown is opened
  useEffect(() => {
    if (dropdownIsOpen) onClose();
  }, [dropdownIsOpen]);

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
      portalRef={ref}
      scrollContainer={guideCueRef?.current}
      portalContainer={guideCueRef?.current}
      tooltipClassName={cx(css`
        min-width: 360px;
        padding: 0;
        background-color: ${palette.white};

        svg {
          fill: ${palette.purple.light3};
        }

        // Hide title label (ghost margin)
        #guide-cue-label {
          display: none;
        }

        // Hide Footer with button (no way with LG to hide)
        > div > div > div:last-child {
          display: none;
        }
      `)}
    >
      <GuideCueContent>
        <GuideCueHeader>
          {/* Invisible button to trap focus. Ask from design to not have close button auto-focused */}
          <FocusTrapInvisibleButton />
          <CloseButton
            onClick={onClose}
            className={cx(css`
              color: ${palette.gray.base};
              &:hover,
              &:active {
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
          <H3>Announcing: Dark Mode 🌙</H3>
          <Body>Choose between dark mode, light mode or system theme to match your reading preferences</Body>
        </GuideCueFooter>
      </GuideCueContent>
    </GuideCue>
  );
};

DarkModeGuideCue.propTypes = {
  guideCueRef: PropTypes.shape({ current: PropTypes.object }),
  dropdownIsOpen: PropTypes.bool.isRequired,
};

export default DarkModeGuideCue;
