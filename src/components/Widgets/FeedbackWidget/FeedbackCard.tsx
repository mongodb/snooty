import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import LeafygreenCard from '@leafygreen-ui/card';
import { theme } from '../../../theme/docsTheme';
import useScreenSize from '../../../hooks/useScreenSize';
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

export type FeedbackCardProps = {
  isOpen: boolean;
  children: ReactNode;
};

const FeedbackCard = ({ isOpen, children }: FeedbackCardProps) => {
  const { abandon } = useFeedbackContext();
  // Ensure FeedbackCard can be fullscreen size
  const { isMobile } = useScreenSize();
  useNoScroll(isMobile);

  const onClose = () => {
    abandon();
  };

  return (
    isOpen && (
      <CardContainer>
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
