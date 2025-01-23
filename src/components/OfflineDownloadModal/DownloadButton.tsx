import React, { useState } from 'react';
import Button from '@leafygreen-ui/button';
import { css } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { ToastProvider } from '@leafygreen-ui/toast';
import { reportAnalytics } from '../../utils/report-analytics';
import { theme } from '../../theme/docsTheme';
import DownloadModal from './DownloadModal';
import { OfflineDownloadProvider } from './DownloadContext';

const downloadIconStyling = css`
  width: 32px;
  height: 22px;

  .dark-theme & {
    color: var(--white);
    background-color: var(--gray-dark2);
  }
`;

const toastPortalStyling = css`
  z-index: ${theme.zIndexes.sidenav + 1};
`;

const DownloadButton = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openDownloadModal = () => {
    reportAnalytics('Offline docs download button clicked');
    setModalOpen(true);
  };

  return (
    <ToastProvider portalClassName={toastPortalStyling}>
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

      <OfflineDownloadProvider modalOpen={modalOpen}>
        <DownloadModal open={modalOpen} setOpen={setModalOpen} />
      </OfflineDownloadProvider>
    </ToastProvider>
  );
};

export default DownloadButton;
