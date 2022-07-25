import React from 'react';
import styled from '@emotion/styled';
import { useFeedbackState } from './context';
import LeafygreenModal from '@leafygreen-ui/modal';

export default function FeedbackModal({ isOpen, children }) {
  const { abandon } = useFeedbackState();
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
}
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
