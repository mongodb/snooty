import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import Image from '../Image';
import { getNestedValue } from '../../utils/get-nested-value';
import { theme } from '../../theme/docsTheme';
import Lightbox from './Lightbox';
import CaptionLegend from './CaptionLegend';

const Figure = ({ ...props }) => {
  const figWidth = parseInt(getNestedValue(['nodeData', 'options', 'figwidth'], props), 10);
  const imgWidth = parseInt(getNestedValue(['nodeData', 'options', 'width'], props), 10);

  const [isLightboxSize] = useState(figWidth && figWidth / imgWidth < 0.9);

  const { nodeData, ...rest } = props;

  if (isLightboxSize || (nodeData.options && nodeData.options.lightbox)) {
    return <Lightbox {...props} nodeData={nodeData} />;
  }

  return (
    <div
      className="figure"
      css={css`
        max-width: 100%;
        margin-top: ${theme.size.medium};
        margin-bottom: ${theme.size.medium};
      `}
      style={{ width: getNestedValue(['options', 'figwidth'], nodeData) || 'auto' }}
    >
      <Image nodeData={nodeData} {...props} />
      <CaptionLegend {...rest} nodeData={nodeData} />
    </div>
  );
};

export default Figure;

Figure.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    options: PropTypes.shape({
      alt: PropTypes.string,
      lightbox: PropTypes.bool,
      checksum: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
