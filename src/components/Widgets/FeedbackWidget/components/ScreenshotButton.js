import React from 'react';
import Button from '@leafygreen-ui/button';
import Tooltip from './LeafygreenTooltip';
import { CameraIcon, SpinnerIcon, CheckIcon } from '../icons';
import { uiColors } from '@leafygreen-ui/palette';
import useScreenshot from '../hooks/useScreenshot';

export default function ScreenshotButton({ size = 'default', ...props }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const { screenshot, loading, takeScreenshot } = useScreenshot();
  const label = screenshot ? 'Screenshot Saved' : loading ? 'Taking Screenshot' : 'Take a Screenshot';
  return (
    <div id="screenshot-button" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Tooltip
        align="bottom"
        justify="middle"
        triggerEvent="hover"
        open={isHovered}
        trigger={
          <Button variant="default" label={label} onClick={takeScreenshot} {...props}>
            {screenshot ? (
              <CheckIcon style={{ color: uiColors.green.base }} />
            ) : loading ? (
              <SpinnerIcon />
            ) : (
              <CameraIcon />
            )}
          </Button>
        }
      >
        {label}
      </Tooltip>
    </div>
  );
}
