import React from 'react';
import Button from '@leafygreen-ui/button';
import { css } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { reportAnalytics } from '../../utils/report-analytics';
import { useOfflineDownloadContext } from './DownloadContext';

const downloadIconStyling = css`
  width: 32px;
  height: 22px;

  .dark-theme & {
    color: var(--white);
    background-color: var(--gray-dark2);
  }
`;

const DownloadButton = () => {
  const { setModalOpen } = useOfflineDownloadContext();

  const openDownloadModal = () => {
    reportAnalytics('Offline docs download button clicked');
    setModalOpen(true);
  };

  return (
    <Button
      size={'small'}
      className={downloadIconStyling}
      aria-label="Download Offline Docs"
      onClick={(e) => {
        // required to prevent being used within links
        e.stopPropagation();
        openDownloadModal();
      }}
    >
      <Icon size={14} glyph={'Download'} />
    </Button>
  );
};

export default DownloadButton;
