import React from 'react';
import styled from '@emotion/styled';
import LeafygreenModal from '@leafygreen-ui/modal';
import { useFeedbackContext } from './context';
import ProgressBar from './components/PageIndicators';

const Modal = styled(LeafygreenModal)`
  padding-bottom: 0;
  z-index: 1;

  > div {
    padding-top: 200px;
    > div {
      padding-bottom: 0px;
    }
  }
`;

const Header = styled.div`
  padding: 8px;
  margin-bottom: 10px;
  margin-top: -27px;
`;

const HeaderControls = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 7fr 1fr;
  > span {
    padding-left: 120px !important;
  }
`;

const FeedbackModal = ({ isOpen, children }) => {
  const { abandon } = useFeedbackContext();
  return (
    <Modal
      className="feedback-form"
      size="small"
      open={isOpen}
      shouldClose={async () => {
        await abandon();
        return true;
      }}
    >
      <Header>
        <HeaderControls>
          <ProgressBar />
        </HeaderControls>
      </Header>
      {children}
    </Modal>
  );
};

export default FeedbackModal;
