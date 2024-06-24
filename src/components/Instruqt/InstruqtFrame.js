import React from 'react';
import PropTypes from 'prop-types';
import { palette } from '@leafygreen-ui/palette';
import { css, cx } from '@leafygreen-ui/emotion';

const iframeStyle = css`
  border: var(--border);
  border-radius: var(--border-radius);
`;

const InstruqtFrame = ({ title, height, embedValue, darkMode }) => {
  const labTitle = title || 'MongoDB Interactive Lab';
  const frameTitle = `Instruqt - ${labTitle}`;
  // Allow frameHeight to be 0 when drawer is closed to avoid iframe overflowing
  const frameHeight = height ?? '640';
  const frameSrc = `https://play.instruqt.com/embed${embedValue}`;

  return (
    <iframe
      className={cx(iframeStyle)}
      allowFullScreen
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
      title={frameTitle}
      height={frameHeight}
      width="100%"
      src={frameSrc}
      style={{
        '--border': darkMode ? `1px solid ${palette.gray.dark2}` : 'none',
        '--border-radius': darkMode ? '5px' : 0,
      }}
    />
  );
};

InstruqtFrame.defaultProps = {
  darkMode: false,
};

InstruqtFrame.prototype = {
  title: PropTypes.string,
  height: PropTypes.string,
  embedValue: PropTypes.string,
  darkMode: PropTypes.bool,
};

export default InstruqtFrame;
