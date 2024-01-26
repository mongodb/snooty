import React, { forwardRef } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import { getLabURL } from './utils';

const iframeStyle = css`
  border: none;
`;

const InstruqtFrame = forwardRef(({ title, height, embedValue }, ref) => {
  const labTitle = title || 'MongoDB Interactive Lab';
  const frameTitle = `Instruqt - ${labTitle}`;
  const frameHeight = height || '640';
  const frameSrc = getLabURL(embedValue);

  return (
    <iframe
      ref={ref}
      className={cx(iframeStyle)}
      allowFullScreen
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
      title={frameTitle}
      height={frameHeight}
      width="100%"
      src={frameSrc}
    />
  );
});

export default InstruqtFrame;
