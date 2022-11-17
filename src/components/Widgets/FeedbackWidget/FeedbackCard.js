import React from 'react';
import styled from '@emotion/styled';
import LeafygreenCard from '@leafygreen-ui/card';
import ProgressBar from './components/PageIndicators';
import CloseButton from './components/CloseButton';
import { useFeedbackContext } from './context';
import { feedbackId } from '../FeedbackWidget/FeedbackForm';
import { theme } from '../../../../src/theme/docsTheme';

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
  height: 340px;
  align-items: center;
  padding: 0;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
  margin-right: 10px;
`;

const Content = styled.div`
  margin: 0px 24px;
`;

const FeedbackCard = ({ isOpen, children }) => {
  const { abandon } = useFeedbackContext();

  return (
    isOpen && (
      <FloatingContainer id={feedbackId}>
        <Card>
          <CardHeader>
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
