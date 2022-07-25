import React from 'react';
import styled from '@emotion/styled';
import { FeedbackProvider } from './context';
import FloatingContainer from './FloatingContainer';
import FeedbackTab from './FeedbackTab';
import StarRating from './components/StarRating';

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100vh;
  align-items: center;
`;
const StarContainer = styled.div`
  width: 200px;
`;

function App() {
  return (
    <div className="App" id="main">
      <FeedbackTab />
      <Centered>
        <StarContainer>
          <StarRating size="2x" />
        </StarContainer>
        <br />
        <br />
        <br />
        <FloatingContainer />
      </Centered>
    </div>
  );
}

export default () => (
  <FeedbackProvider>
    <App />
  </FeedbackProvider>
);
