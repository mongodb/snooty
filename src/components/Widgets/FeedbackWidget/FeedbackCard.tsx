import React, { useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import LeafygreenCard from '@leafygreen-ui/card';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';
import { theme } from '../../../theme/docsTheme';
import useScreenSize from '../../../hooks/useScreenSize';
import useStickyTopValues from '../../../hooks/useStickyTopValues';
import { InstruqtContext } from '../../Instruqt/instruqt-context';
import { HeaderContext } from '../../Header/header-context';
import ProgressBar from './components/PageIndicators';
import CloseButton from './components/CloseButton';
import { useFeedbackContext } from './context';
import useNoScroll from './hooks/useNoScroll';

const CardContainer = styled.div`
  @media ${theme.screenSize.upToLarge} {
    height: 100%;
    background-color: rgba(0, 30, 43, 0.6); /* #001E2B with 60% opacity */
  }
`;

const Card = styled(LeafygreenCard)`
  /* Card Size */
  width: 290px;
  padding: ${theme.size.medium} ${theme.size.default};
  display: flex;
  flex-direction: column;
  position: relative;

  @media ${theme.screenSize.upToLarge} {
    width: 50%;
    padding: 20px;
    margin: auto;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media ${theme.screenSize.upToSmall} {
    width: 90%;
  }
`;

const FeedbackCard = ({ isOpen, children }) => {
  const { abandon } = useFeedbackContext();
  const { isOpen: isLabOpen } = useContext(InstruqtContext);
  // Ensure FeedbackCard can be fullscreen size
  const { isMobile } = useScreenSize();
  const { darkMode } = useDarkMode();
  const { topSmall } = useStickyTopValues(false, true);
  useNoScroll(isMobile);
  const { bannerContent } = useContext(HeaderContext);
  const topBuffer = useMemo(
    () => parseInt(topSmall, 10) + (!!bannerContent ? parseInt(theme.header.bannerHeight, 10) : 0) + 'px',
    [bannerContent, topSmall]
  );

  const onClose = () => {
    abandon();
  };

  return (
    isOpen && (
      <CardContainer darkMode={darkMode} top={topBuffer} hasOpenLabDrawer={isLabOpen}>
        <Card>
          <CloseButton onClick={onClose} />
          <ProgressBar />
          <div>{children}</div>
        </Card>
      </CardContainer>
    )
  );
};

export default FeedbackCard;
