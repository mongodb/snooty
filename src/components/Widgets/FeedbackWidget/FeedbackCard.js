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

  @media ${theme.screenSize.upToMedium} {
    right: 0;
    top: 108px;
  }
`;

const Card = styled(LeafygreenCard)`
  /* Card Size */
  width: 234px;
  display: flex;
  flex-direction: column;
  position: relative;

  @media ${theme.screenSize.upToMedium} {
    height: calc(100vh - 108px);
    width: 100vw;
    border-radius: 0;
  }
`;

const FeedbackCard = ({ isOpen, children }) => {
  const { abandon } = useFeedbackContext();

  return (
    isOpen && (
      <FloatingContainer id={feedbackId}>
        <Card>
          <CloseButton onClick={() => abandon()} />
          <ProgressBar />
          <div>{children}</div>
        </Card>
      </FloatingContainer>
    )
  );
};

export default FeedbackCard;
