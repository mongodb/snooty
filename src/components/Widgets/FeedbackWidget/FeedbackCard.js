import React from 'react';
import styled from '@emotion/styled';
import LeafygreenCard from '@leafygreen-ui/card';
import { feedbackId } from '../FeedbackWidget/FeedbackForm';
import { theme } from '../../../../src/theme/docsTheme';
import ProgressBar from './components/PageIndicators';
import CloseButton from './components/CloseButton';
import { useFeedbackContext } from './context';

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
  height: 404px;
  padding: 16px 16px 32px;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
`;

const Content = styled.div`
  margin: 0px 8px;
  display: flex;
  // Allow content to take up the remaining space of the card
  flex-grow: 1;
`;

const FeedbackCard = ({ isOpen, children }) => {
  const { abandon } = useFeedbackContext();

  return (
    isOpen && (
      <FloatingContainer id={feedbackId}>
        <Card>
          <CardHeader>
            {/* Empty div to help align items better */}
            <div />
            <ProgressBar />
            <CloseButton onClick={() => abandon()} />
          </CardHeader>
          <Content>{children}</Content>
        </Card>
      </FloatingContainer>
    )
  );
};

export default FeedbackCard;
