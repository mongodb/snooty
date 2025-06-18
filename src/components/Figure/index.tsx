import React, { useState } from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import Image from '../Image';
import { getNestedValue } from '../../utils/get-nested-value';
import { theme } from '../../theme/docsTheme';
import Lightbox from './Lightbox';
import CaptionLegend from './CaptionLegend';
import { FigureNode } from '../../types/ast';

export type FigureProps = {
  nodeData: FigureNode;
};

const Figure = ({ ...props }: FigureProps) => {
  const figWidth = parseInt(getNestedValue(['nodeData', 'options', 'figwidth'], props), 10);
  const imgWidth = parseInt(getNestedValue(['nodeData', 'options', 'width'], props), 10);

  const [isLightboxSize] = useState(figWidth && figWidth / imgWidth < 0.9);

  const { nodeData, ...rest } = props;

  if (isLightboxSize || (nodeData.options && nodeData.options.lightbox)) {
    return <Lightbox {...props} nodeData={nodeData} />;
  }

  return (
    <div
      className={cx(
        'figure',
        css`
          max-width: 100%;
          margin-top: ${theme.size.medium};
          margin-bottom: ${theme.size.medium};
        `
      )}
      style={{ width: getNestedValue(['options', 'figwidth'], nodeData) || 'auto' }}
    >
      <Image nodeData={nodeData} {...rest} />
      <CaptionLegend nodeData={nodeData} {...rest} />
    </div>
  );
};

export default Figure;
