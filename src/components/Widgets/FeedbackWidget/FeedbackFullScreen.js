import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { HeaderContext } from '../../Header/header-context';
import useNoScroll from './hooks/useNoScroll';
import { useFeedbackContext } from './context';
import ProgressBar from './components/PageIndicators';
import CloseButton from './components/CloseButton';

const FullScreen = styled.div(
  (props) => `
    background: white;
    height: 100vh;
    left: 0;
    overflow-y: scroll;
    padding-top: ${props.totalHeaderHeight};
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 1;
  `
);

const Header = styled.div`
  padding: 8px;
  margin-bottom: 20px;
  margin-top: 25px;
  position: relative;
  display: grid;
  grid-template-columns: 7fr 1fr;
  justify-content: center;
  > span {
    padding-left: 116px !important;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 280px;
  margin: 0 auto;
  padding: 0 56px;
`;

const FeedbackFullScreen = ({ isOpen, children }) => {
  const { abandon } = useFeedbackContext();
  const { totalHeaderHeight } = useContext(HeaderContext);
  useNoScroll(isOpen);
  return (
    isOpen && (
      <FullScreen totalHeaderHeight={totalHeaderHeight}>
        <Header>
          <ProgressBar />
          <CloseButton size="xlarge" onClick={abandon} />
        </Header>
        <Content>{children}</Content>
      </FullScreen>
    )
  );
};

export default FeedbackFullScreen;
