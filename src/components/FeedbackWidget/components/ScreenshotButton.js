import React from 'react';
import Button from '@leafygreen-ui/button';
import Tooltip from './LeafygreenTooltip';
import { CameraIcon, SpinnerIcon, CheckIcon } from '../icons';
import { uiColors } from '@leafygreen-ui/palette';

export default function ScreenshotButton({ takeScreenshot, loading, screenshot, size = 'default', ...props }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const label = screenshot ? 'Screenshot Saved' : loading ? 'Taking Screenshot' : 'Take a Screenshot';
  return (
    <div id="screenshot-button" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Tooltip
        align="bottom"
        justify="middle"
        triggerEvent="hover"
        variant="dark"
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
