import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from '@leafygreen-ui/modal';
import styled from '@emotion/styled';
import Image from '../Image';
import { theme } from '../../theme/docsTheme.js';
import CaptionLegend from './CaptionLegend';

const CAPTION_TEXT = 'click to enlarge';

const MODAL_PADDING = '64px';
const MODAL_DIALOG_PADDING = '40px';

const StyledModal = styled(Modal)`
  // Set z-index to appear above side nav and top navbar
  z-index: 10;
  margin-top: ${theme.header.navbarHeight};

  div[role='dialog'] {
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
`;

const LightboxWrapper = styled('div')`
  width: ${(props) => props.figwidth};
  cursor: pointer;
  margin-top: ${theme.size.medium};
  margin-bottom: ${theme.size.medium};
  display: block;
`;

const Lightbox = ({ nodeData, ...rest }) => {
  const [open, setOpen] = useState(false);
  const figureWidth = nodeData.options?.figwidth || 'auto';
  const openModal = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  return (
    <React.Fragment>
      <LightboxWrapper figwidth={figureWidth}>
        <div onClick={openModal} role="button" tabIndex="-1">
          <Image nodeData={nodeData} />
          <LightboxCaption>{CAPTION_TEXT}</LightboxCaption>
        </div>
        <CaptionLegend {...rest} nodeData={nodeData} />
      </LightboxWrapper>
      <StyledModal size="medium" open={open} setOpen={setOpen}>
        <Image nodeData={nodeData} />
      </StyledModal>
    </React.Fragment>
  );
};

Lightbox.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    options: PropTypes.shape({
      alt: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Lightbox;
