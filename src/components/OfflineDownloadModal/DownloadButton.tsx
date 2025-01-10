import React, { useState } from 'react';
import { css } from '@leafygreen-ui/emotion';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
// import { reportAnalytics } from '../../utils/report-analytics';
import DownloadModal from './DownloadModal';
import { OfflineDownloadProvider } from './DownloadContext';

const downloadIconStyling = css`
  width: 32px;
  height: 22px;
`;

const DownloadButton = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openDownloadModal = () => {
    // reportAnalytics('Offline docs download button clicked');
    setModalOpen(true);
  };

  return (
    <>
      <Button
        size={'small'}
        className={downloadIconStyling}
        aria-label="Download Offline Docs"
        onClick={(e) => {
          openDownloadModal();
        }}
      >
        <Icon size={14} glyph={'Download'} />
      </Button>

      <OfflineDownloadProvider modalOpen={modalOpen}>
        <DownloadModal open={modalOpen} setOpen={setModalOpen} />
      </OfflineDownloadProvider>
    </>
  );
};

export default DownloadButton;
