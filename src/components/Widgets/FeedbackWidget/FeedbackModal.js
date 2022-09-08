import React from 'react';
import styled from '@emotion/styled';
import LeafygreenModal from '@leafygreen-ui/modal';
import { useFeedbackContext } from './context';

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
      {children}
    </Modal>
  );
};

export default FeedbackModal;
