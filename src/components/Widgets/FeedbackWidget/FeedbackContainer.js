import React, { useRef } from 'react';
import { cx } from '@leafygreen-ui/emotion';
import { useClickOutside } from '../../../hooks/use-click-outside';
import useScreenSize from '../../../hooks/useScreenSize';
import { useFeedbackContext } from './context';

const FeedbackContainer = ({ children, className }) => {
  const ref = useRef(null);
  const { abandon, isScreenshotButtonClicked } = useFeedbackContext();
  const { isMobile } = useScreenSize();

  useClickOutside(ref, () => {
    !isMobile && !isScreenshotButtonClicked && abandon();
  });

  return (
    <div className={cx(className)} ref={ref}>
      {children}
    </div>
  );
};

export default FeedbackContainer;
