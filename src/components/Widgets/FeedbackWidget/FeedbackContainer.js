import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { useClickOutside } from '../../../hooks/use-click-outside';
import { useFeedbackContext } from './context';

const Container = styled.div`
  position: relative;
`;

const FeedbackContainer = ({ children }) => {
  const ref = useRef(null);
  const { abandon } = useFeedbackContext();

  useClickOutside(ref, abandon);

  return <Container ref={ref}>{children}</Container>;
};

export default FeedbackContainer;
