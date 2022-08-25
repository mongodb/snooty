import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@leafygreen-ui/modal';
import styled from '@emotion/styled';
import CaptionLegend from './CaptionLegend';
import Image from '../Image';
import { theme } from '../../theme/docsTheme.js';

const CAPTION_TEXT = 'click to enlarge';
const StyledModal = styled(Modal)`
  // Set z-index to appear above side nav and top navbar
  z-index: 10;

  @media ${theme.screenSize.largeAndUp} {
    div[role='dialog'] {
      width: 80%;
    }
  }

  @media ${theme.screenSize.upToLarge} {
    div[role='dialog'] {
      width: 100%;
    }
  }

  img {
    width: 100%;
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
  return (
    <React.Fragment>
      <LightboxWrapper figwidth={figureWidth}>
        <div onClick={() => setOpen((curr) => !curr)} role="button" tabIndex="-1">
          <Image nodeData={nodeData} />
          <LightboxCaption>{CAPTION_TEXT}</LightboxCaption>
        </div>
        <CaptionLegend {...rest} nodeData={nodeData} />
      </LightboxWrapper>
      <StyledModal size="large" open={open} setOpen={setOpen}>
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
