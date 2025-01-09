import React, { useState } from 'react';
import { css } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import IconButton from '@leafygreen-ui/icon-button';
// import { reportAnalytics } from '../../utils/report-analytics';
import DownloadModal from './DownloadModal';
import { OfflineDownloadProvider } from './DownloadContext';

const downloadIconStyling = css``;

const DownloadButton = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openDownloadModal = () => {
    // reportAnalytics('Offline docs download button clicked');
    setModalOpen(true);
  };

  return (
    <>
      <IconButton className={downloadIconStyling} aria-label="Download Offline Docs" onClick={openDownloadModal}>
        <Icon glyph={'Download'} />
      </IconButton>

      <OfflineDownloadProvider modalOpen={modalOpen}>
        <DownloadModal open={modalOpen} setOpen={setModalOpen} />
      </OfflineDownloadProvider>
    </>
  );
};

export default DownloadButton;
