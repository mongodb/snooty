import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@leafygreen-ui/modal';
import CaptionLegend from './CaptionLegend';
import Image from './Image';
import { theme } from '../theme/docsTheme.js';
import styled from '@emotion/styled';

const CAPTION_TEXT = 'click to enlarge';
const StyledModal = styled(Modal)`
  @media ${theme.screenSize.largeAndUp} {
    div[role='dialog'] {
      width: 40%;
    }
    img {
      width: 100%;
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

const Lightbox = ({ nodeData, ...rest }) => {
  const [open, setOpen] = useState(false);
  const LightboxWrapper = styled('div')`
    ${{ width: nodeData.options?.figwidth || 'auto' }}
    cursor: pointer;
    margin: 0;
    display: block;
  `;

  return (
    <React.Fragment>
      <LightboxWrapper>
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
