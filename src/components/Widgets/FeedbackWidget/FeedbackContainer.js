import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { useClickOutside } from '../../../hooks/use-click-outside';
import useScreenSize from '../../../hooks/useScreenSize';
import { theme } from '../../../../src/theme/docsTheme';
import { useFeedbackContext } from './context';

const Container = styled.div`
  position: relative;

  @media ${theme.screenSize.tablet} {
    z-index: 1;
  }
`;

const FeedbackContainer = ({ children }) => {
  const ref = useRef(null);
  const { abandon, isScreenshotButtonClicked } = useFeedbackContext();
  const { isMobile } = useScreenSize();

  useClickOutside(ref, () => {
    !isMobile && !isScreenshotButtonClicked && abandon();
  });

  return <Container ref={ref}>{children}</Container>;
};

export default FeedbackContainer;
