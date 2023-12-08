import React from 'react';
import styled from '@emotion/styled';
import LeafygreenCard from '@leafygreen-ui/card';
import { feedbackId } from '../FeedbackWidget/FeedbackForm';
import { theme } from '../../../../src/theme/docsTheme';
import useScreenSize from '../../../hooks/useScreenSize';
import useStickyTopValues from '../../../hooks/useStickyTopValues';
import ProgressBar from './components/PageIndicators';
import CloseButton from './components/CloseButton';
import { useFeedbackContext } from './context';
import useNoScroll from './hooks/useNoScroll';

const FloatingContainer = styled.div`
  position: fixed;
  z-index: 14;
  bottom: ${theme.size.large};
  right: ${theme.size.large};

  @media ${theme.screenSize.upToSmall} {
    position: fixed;
    right: 0;
    top: ${({ top }) => top};
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
    height: calc(100vh - ${({ top }) => top});
    width: 100vw;
    border-radius: 0;
    border-width: 0px;
    padding-top: 40px;
  }
`;

const FeedbackCard = ({ isOpen, children }) => {
  const { abandon } = useFeedbackContext();
  // Ensure FeedbackCard can be fullscreen size
  const { isMobile } = useScreenSize();
  const { topSmall } = useStickyTopValues();
  useNoScroll(isMobile);

  return (
    isOpen && (
      <FloatingContainer top={topSmall} id={feedbackId}>
        <Card top={topSmall}>
          <CloseButton onClick={() => abandon()} />
          <ProgressBar />
          <div>{children}</div>
        </Card>
      </FloatingContainer>
    )
  );
};

export default FeedbackCard;
