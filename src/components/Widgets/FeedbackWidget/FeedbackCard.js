import React from 'react';
import styled from '@emotion/styled';
import LeafygreenCard from '@leafygreen-ui/card';
import { feedbackId } from '../FeedbackWidget/FeedbackForm';
import { theme } from '../../../../src/theme/docsTheme';
import ProgressBar from './components/PageIndicators';
import CloseButton from './components/CloseButton';
import { useFeedbackContext } from './context';

const HEIGHTS = {
  sentiment: 175,
  comment: 404,
  submitted: 427,
};

const FloatingContainer = styled.div`
  position: fixed;
  z-index: 14;
  right: 16px;

  @media ${theme.screenSize.upToLarge} {
    top: 40%;
  }

  @media ${theme.screenSize.largeAndUp} {
    bottom: 40px;
  }
`;

const Card = styled(LeafygreenCard)`
  /* Card Size */
  width: 234px;
  // height: ${({ view }) => HEIGHTS[view]}px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CardHeader = styled.div`
  // display: grid;
  // grid-template-columns: 1fr 2fr 1fr;
`;

const Content = styled.div`
  display: flex;
  // Allow content to take up the remaining space of the card
  flex-grow: 1;
`;

const FeedbackCard = ({ isOpen, children, view }) => {
  const { abandon } = useFeedbackContext();

  return (
    isOpen && (
      <FloatingContainer id={feedbackId}>
        <Card view={view}>
          <ProgressBar />
          <CardHeader>
            {/* Empty div to help align items better */}
            <div />
            <CloseButton onClick={() => abandon()} />
          </CardHeader>
          <Content>{children}</Content>
        </Card>
      </FloatingContainer>
    )
  );
};

export default FeedbackCard;
