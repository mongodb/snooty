import React, { useState, useCallback } from 'react';
import Modal, { type ModalProps, ModalSize } from '@leafygreen-ui/modal';
import styled from '@emotion/styled';
import { palette } from '@leafygreen-ui/palette';
import Image from '../Image';
import { theme } from '../../theme/docsTheme';
import { reportAnalytics } from '../../utils/report-analytics';
import { currentScrollPosition } from '../../utils/current-scroll-position';
import CaptionLegend from './CaptionLegend';
import { FigureProps } from '.';

const CAPTION_TEXT = 'click to enlarge';

const MODAL_PADDING = '64px';
const MODAL_DIALOG_PADDING = '40px';

const StyledModal = styled(Modal as React.ComponentType<ModalProps>)`
  // Set z-index to appear above side nav and top navbar
  z-index: 10;
  ${process.env['GATSBY_ENABLE_DARK_MODE'] !== 'true' ? `margin-top: ${theme.header.navbarHeight}` : ''};

  div[role='dialog'] {
    width: 80%;
    max-width: 80%;
    max-height: calc(100vh - ${theme.header.navbarHeight} - ${MODAL_DIALOG_PADDING});
    transition: none;
  }

  img {
    max-height: calc(
      100vh - ${theme.header.navbarHeight} - ${MODAL_DIALOG_PADDING} - ${MODAL_PADDING} - ${MODAL_PADDING} -
        ${MODAL_DIALOG_PADDING}
    );
    width: auto;
  }

  @media ${theme.screenSize.largeAndUp} {
  }

  @media ${theme.screenSize.upToLarge} {
    div[role='dialog'] {
      max-width: 100%;
    }
    img {
      max-height: 300px;
    }
  }
`;

const LightboxCaption = styled('div')`
  color: #444;
  font-size: 80%;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  text-align: center;

  .dark-theme & {
    color: ${palette.gray.light2};
  }
`;

const LightboxWrapper = styled('div')<{ figwidth: string }>`
  width: ${({ figwidth }) => figwidth};
  cursor: pointer;
  margin-top: ${theme.size.medium};
  margin-bottom: ${theme.size.medium};
  display: block;
  max-width: 100%;
`;

const Lightbox = ({ nodeData, ...rest }: FigureProps) => {
  const [open, setOpen] = useState(false);
  const figureWidth = nodeData.options?.figwidth || 'auto';
  const openModal = useCallback(() => {
    reportAnalytics('Click', {
      position: 'body',
      position_context: 'image enlarged',
      label: nodeData.name,
      scroll_position: currentScrollPosition(),
      tagbook: 'true',
    });
    setOpen((prevOpen) => !prevOpen);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <LightboxWrapper figwidth={figureWidth}>
        <div onClick={openModal} role="button" tabIndex={-1}>
          <Image nodeData={nodeData} {...rest} />
          <LightboxCaption>{CAPTION_TEXT}</LightboxCaption>
        </div>
        <CaptionLegend {...rest} nodeData={nodeData} />
      </LightboxWrapper>
      <StyledModal size={ModalSize.Large} open={open} setOpen={setOpen}>
        <Image nodeData={nodeData} />
      </StyledModal>
    </React.Fragment>
  );
};

export default Lightbox;
