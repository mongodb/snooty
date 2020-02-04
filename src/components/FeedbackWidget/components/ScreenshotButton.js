import React from 'react';
import Button from '@leafygreen-ui/button';
import Tooltip from '@leafygreen-ui/tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useFeedbackState } from '../context';
import { useScreenshot } from '../../../components/Screenshot';

function useSaveScreenshot() {
  const { submitScreenshot } = useFeedbackState();
  const { screenshot } = useScreenshot();
  const save = () => {
    if (screenshot) submitScreenshot(screenshot);
  };
  React.useEffect(save, [screenshot]);
}

export default function ScreenshotButton({ onClick, size = 'default', ...props }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const { screenshot, loading, takeScreenshot } = useScreenshot();
  const label = screenshot ? 'Screenshot Saved' : loading ? 'Taking Screenshot' : 'Take a Screenshot';
  useSaveScreenshot();
  const handleClick = async () => {
    if (screenshot || loading) return;
    await takeScreenshot();
  };
  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Tooltip
        align="bottom"
        justify="middle"
        triggerEvent="hover"
        variant="dark"
        open={isHovered}
        trigger={
          <Button variant="default" label={label} onClick={handleClick} {...props}>
            {screenshot ? <CheckIcon /> : loading ? <SpinnerIcon /> : <CameraIcon />}
          </Button>
        }
      >
        {label}
      </Tooltip>
    </div>
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
