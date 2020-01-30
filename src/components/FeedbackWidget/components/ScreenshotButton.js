import React from 'react';
import Button from '@leafygreen-ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useScreenshot } from '../../../components/Screenshot';
import { useFeedbackState } from '../context';

function useSaveScreenshot() {
  const { submitScreenshot } = useFeedbackState();
  const { screenshot } = useScreenshot();
  const save = () => {
    if (screenshot) submitScreenshot(screenshot);
  };
  React.useEffect(save, [screenshot]);
}

export default function ScreenshotButton({ onClick, size = 'default', ...props }) {
  const { screenshot, loading, takeScreenshot } = useScreenshot();
  const label = screenshot ? 'Screenshot Saved' : loading ? 'Taking Screenshot' : 'Take a Screenshot';
  useSaveScreenshot();
  const handleClick = async () => {
    if (screenshot || loading) return;
    await takeScreenshot();
  };
  return (
    <Button variant="default" ariaLabel={label} onClick={handleClick} {...props}>
      {screenshot ? <CheckIcon /> : loading ? <SpinnerIcon /> : <CameraIcon />}
    </Button>
  );
}

const CameraIcon = props => (
  <FontAwesomeIcon icon={findIconDefinition({ prefix: 'fas', iconName: 'camera' })} {...props} />
);

const SpinnerIcon = props => (
  <FontAwesomeIcon icon={findIconDefinition({ prefix: 'fas', iconName: 'spinner' })} {...props} spin />
);

const CheckIcon = props => (
  <FontAwesomeIcon icon={findIconDefinition({ prefix: 'fas', iconName: 'check' })} {...props} />
);
