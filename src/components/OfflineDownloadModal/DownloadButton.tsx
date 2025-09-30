import React from 'react';
import Button, { Size } from '@leafygreen-ui/button';
import { css } from '@leafygreen-ui/emotion';
import Icon from '@leafygreen-ui/icon';
import { reportAnalytics } from '../../utils/report-analytics';
import { displayNone } from '../../utils/display-none';
import useScreenSize from '../../hooks/useScreenSize';
import { useOfflineDownloadContext } from './DownloadContext';

const downloadIconStyling = css`
  width: 32px;
  height: 22px;

  .dark-theme & {
    color: var(--white);
    background-color: var(--gray-dark2);
  }

  ${displayNone.onMobileAndTablet};
`;

const DownloadButton = () => {
  const { setModalOpen } = useOfflineDownloadContext();
  const { isTabletOrMobile } = useScreenSize();

  const openDownloadModal = () => {
    if (isTabletOrMobile) return;
    reportAnalytics('Click', {
      properties: {
        position: 'SideNav',
        position_context: 'download button clicked',
        label: 'offline docs download button clicked',
        label_text_displayed: 'offline docs download button clicked',
      },
    });
    setModalOpen(true);
  };

  return (
    <Button
      size={Size.Small}
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
