import React, { useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import LeafygreenCard from '@leafygreen-ui/card';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { palette } from '@leafygreen-ui/palette';
import { feedbackId } from '../FeedbackWidget/FeedbackForm';
import { theme } from '../../../../src/theme/docsTheme';
import useScreenSize from '../../../hooks/useScreenSize';
import useStickyTopValues from '../../../hooks/useStickyTopValues';
import { InstruqtContext } from '../../Instruqt/instruqt-context';
import { elementZIndex } from '../../../utils/dynamically-set-z-index';
import { HeaderContext } from '../../Header/header-context';
import ProgressBar from './components/PageIndicators';
import CloseButton from './components/CloseButton';
import { useFeedbackContext } from './context';
import useNoScroll from './hooks/useNoScroll';

const FloatingContainer = styled.div`
  @media ${theme.screenSize.upToSmall} {
    padding-top: ${({ top }) => `${top}`};
    right: 0;
    top: 0;
    bottom: 60px;
    background-color: ${({ darkMode }) => (darkMode ? palette.black : palette.white)};
  }
`;

const Card = styled(LeafygreenCard)`
  /* Card Size */
  width: 234px;
  display: flex;
  flex-direction: column;
  position: relative;

  @media ${theme.screenSize.upToLarge} {
    width: 262px;
  }

  @media ${theme.screenSize.upToSmall} {
    width: 100vw;
    border-radius: 0;
    border-width: 0px;
    box-shadow: none;
  }
`;

const FeedbackCard = ({ isOpen, children }) => {
  const { abandon } = useFeedbackContext();
  const { isOpen: isLabOpen } = useContext(InstruqtContext);
  // Ensure FeedbackCard can be fullscreen size
  const { isMobile } = useScreenSize();
  const { darkMode } = useDarkMode();
  const { topSmall } = useStickyTopValues(false, process.env['GATSBY_ENABLE_DARK_MODE'] && isMobile);
  useNoScroll(isMobile);
  const { bannerContent } = useContext(HeaderContext);
  const topBuffer = useMemo(
    () => parseInt(topSmall, 10) + (!!bannerContent ? parseInt(theme.header.bannerHeight, 10) : 0) + 'px',
    [bannerContent, topSmall]
  );

  const onClose = () => {
    abandon();
    // reset the z-index set by the screenshot button in ScreenshotButton.js
    elementZIndex.setZIndex('.widgets', theme.zIndexes.header);
  };

  return (
    isOpen && (
      <FloatingContainer darkMode={darkMode} top={topBuffer} id={feedbackId} hasOpenLabDrawer={isLabOpen}>
        <Card>
          <CloseButton onClick={onClose} />
          <ProgressBar />
          <div>{children}</div>
        </Card>
      </FloatingContainer>
    )
  );
};

export default FeedbackCard;
