import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CaptionLegend from './CaptionLegend';
import Image from './Image';
import { getNestedValue } from '../utils/get-nested-value';
import Modal from '@leafygreen-ui/modal';

const CAPTION_TEXT = 'click to enlarge';

const Lightbox = ({ nodeData, ...rest }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <div className="figure lightbox" style={{ width: getNestedValue(['options', 'figwidth'], nodeData) || 'auto' }}>
        <div className="lightbox__imageWrapper" onClick={() => setOpen((curr) => !curr)} role="button" tabIndex="-1">
          <Image nodeData={nodeData} />
          <div className="lightbox__caption">{CAPTION_TEXT}</div>
        </div>
        <CaptionLegend {...rest} nodeData={nodeData} />
      </div>
      <Modal size="large" open={open} setOpen={setOpen}>
        <Image nodeData={nodeData} />
      </Modal>
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
