import React from 'react';
import Button from '@leafygreen-ui/button';
import Tooltip from './LeafygreenTooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';

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
